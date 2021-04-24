#include "CSVParser.jsx"; // Only works with recent versions of CS, doesn't work with CS2

var rootPath = app.activeDocument.path.fsName.replace(/\\/g, '/');
var exportFolderCat = rootPath + "/Export";

function ParseLayerPath(path)
{
    return path.split('/');
}

function GetLayer(curLayer, layerPathAr)
{
    var layerName = layerPathAr.shift();

    for(var x = 0; x < curLayer.layers.length; x++)
    {
        if(curLayer.layers[x].name == layerName)
        {
            if(layerPathAr.length <= 0)
            {
                return curLayer.layers[x];
            }
            else
            {
                return GetLayer(curLayer.layers[x], layerPathAr)
            }
        }
    }
}

function GetLayerFromRoot(layerPathAr)
{
    return GetLayer(app.activeDocument, layerPathAr);
}

function SetTextLayer(layerPath, text)
{
    var layer = GetLayerFromRoot(ParseLayerPath(layerPath));
    layer.textItem.contents = text;
}

function SetOnlyActiveLayer(layerParentPath, onlyActiveName)
{
    var parentLayer = GetLayerFromRoot(ParseLayerPath(layerParentPath));
    for(var x = 0; x < parentLayer.layers.length; x++)
    {
        if(parentLayer.layers[x].name == onlyActiveName)
        {
            parentLayer.layers[x].visible = true;
        }
        else
        {
            parentLayer.layers[x].visible = false;
        }
    }
}

function LoadImageIntoLayerSet(layerSetPath, imagePath)
{
    var mainDoc = activeDocument;
    var folderLayer = GetLayerFromRoot(ParseLayerPath(layerSetPath));

    var loadedFile = new File(imagePath);
    var importDoc = open(loadedFile);

    var importedLayer = importDoc.artLayers[0].duplicate(mainDoc);
    app.activeDocument = mainDoc;
    importDoc.close();

    importedLayer.name = "TMP_IMAGE";
    importedLayer.move(folderLayer, ElementPlacement.INSIDE);
    return importedLayer;
}

function GenerateCards(filePath)
{
    var parsedCSV = new CSVData(filePath);
    var entriesAct = [];
    var cardID = "";
    var exportCategory = "";

    var exportFolder = Folder(exportFolderCat);
    if(!exportFolder.exists) 
    {
        exportFolder.create();
    }

    for (var u = 0; u < parsedCSV.m_entryList.length; u++ ) 
    {
        for(var i = 0; i < parsedCSV.m_entryTypes.length; i++)
        {
            var entryTypeAr = parsedCSV.m_entryTypes[i].split('@');
            var loadedImage;
            switch(entryTypeAr[0])
            {
                case "ID":
                    cardID = parsedCSV.m_entryList[u][i];
                    break;
                case "TEMPLATE":
                    var templatePath = rootPath + "/" + entryTypeAr[1] + "/" + parsedCSV.m_entryList[u][i] + ".psd"
                    if(app.activeDocument.fullName.fsName.replace(/\\/g, '/').toLowerCase() != templatePath.toLowerCase())
                    {
                        app.open(new File(templatePath));
                    }
                    break;
                case "IMG":
                    var imagePath = rootPath + "/" + parsedCSV.m_entryList[u][i] + ".png";
                    loadedImage = LoadImageIntoLayerSet(entryTypeAr[1], imagePath);
                    break;
                case "LAYER":
                    SetOnlyActiveLayer(entryTypeAr[1], parsedCSV.m_entryList[u][i]);
                    break;
                case "TEXT":
                    SetTextLayer(entryTypeAr[1], parsedCSV.m_entryList[u][i]);
                    break;
                case "CATEGORY":
                    exportCategory = parsedCSV.m_entryList[u][i];
                    break;
                default:
                    break;
            }
        }

        var cardFolderCat = exportFolderCat + "/" + exportCategory;
        var fullCardPath = exportFolderCat + "/" + exportCategory + "/" + cardID + ".png";

        var folder = Folder(cardFolderCat);
        if(!folder.exists) 
        {
            folder.create();
        }

        var saveFile = new File(fullCardPath);
        var pngOpts = new PNGSaveOptions();
        pngOpts.interlaced = false;
        activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);

        if(loadedImage != null)
        {
            loadedImage.remove();
        }
    }
}

(function main()
{    
    GenerateCards(rootPath + "/Resources/Les Mondes d'Olim - Cards Sheet.csv");
})();
