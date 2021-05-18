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

function GenerateCards(parsedCSV)
{
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

function LoadImageIntoPosition(layerSetPath, imagePath)
{
    var mainDoc = activeDocument;
    var folderLayer = GetLayerFromRoot(ParseLayerPath(layerSetPath));

    alert(imagePath);
    var loadedFile = new File(imagePath);
    var importDoc = open(loadedFile);

    var importedLayer = importDoc.artLayers[0].duplicate(mainDoc);
    app.activeDocument = mainDoc;
    importDoc.close();

    importedLayer.name = "TMP_IMAGE";
    importedLayer.move(folderLayer, ElementPlacement.INSIDE);
    return importedLayer;
}

function RemoveAllSubLayers(curLayer)
{
    for(var i = (curLayer.layers.length - 1); i > -1; i--)
    {
        curLayer.layers[i].remove();
    }
}

function GenerateCardsBoard(parsedCSV)
{
    var exportFolder = Folder(exportFolderCat);
    if(!exportFolder.exists) 
    {
        exportFolder.create();
    }

    var exportBoardFoler = exportFolderCat + "/Boards";
    var boardFolder = Folder(exportBoardFoler);
    if(!boardFolder.exists) 
    {
        boardFolder.create();
    }

    var boardTemplatePath = rootPath + "/Resources/CardBoardTemplate.psd";

    //Load board template
    app.open(new File(boardTemplatePath));

    //Initialise global infos in pixels (check file unit)
    var printMarginHorizontal = 53;
    var printMarginVertical = 53;

    //Initialise all export properties
    var lastPosX = printMarginHorizontal;
    var lastPosY = printMarginVertical;
    var curCardBoardNb = 1;

    var cardID = "";
    var exportCategory = "";
    var cardQtty = 0;
    var docWidth = app.activeDocument.width.value;
    var docHeight = app.activeDocument.height.value;

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
                case "CATEGORY":
                    exportCategory = parsedCSV.m_entryList[u][i];
                    break;
                case "QUANTITY":
                    var cardQtty = parsedCSV.m_entryList[u][i];
                    break;
                default:
                    break;
            }
        }

        var cardFolderCat = exportFolderCat + "/" + exportCategory;
        var fullCardPath = exportFolderCat + "/" + exportCategory + "/" + cardID + ".png";

        if(cardQtty > 0)
        {
            var origCard = LoadImageIntoPosition("IMAGE", fullCardPath);
            var importWidth = origCard.bounds[2]; //[0] = X, [1] = Y, [2] = SizeX, [3] = SizeY; IN PIXELS
            var importHeight = origCard.bounds[3]; //[0] = X, [1] = Y, [2] = SizeX, [3] = SizeY; IN PIXELS
            var curCard = origCard;

            for(var q = 0; q < cardQtty; q++)
            {
                if(q > 0)
                {
                    curCard = origCard.duplicate();
                }

                if((lastPosX + importWidth) > (docWidth - printMarginHorizontal))
                {
                    lastPosX = printMarginHorizontal;
                    lastPosY = curCard.bounds[3];
                }

                // If we don't have anymore space in this board
                if((lastPosY + importHeight) > (docHeight - printMarginVertical))
                {
                    // Generate clean board number (format: _XXX)
                    var boardFileNumber = "_0";
                    if(curCardBoardNb < 10)
                    {
                        boardFileNumber = "_00";
                    }

                    // Generateboard file name and export as png
                    var exportBoardFile = exportBoardFoler + "/BoardFile" + boardFileNumber + curCardBoardNb + ".png";
                    var saveFile = new File(exportBoardFile);
                    var pngOpts = new PNGSaveOptions();
                    pngOpts.interlaced = false;
                    activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);

                    // Update board number, clean positions and all current content
                    curCardBoardNb += 1;
                    var lastPosX = printMarginHorizontal;
                    var lastPosY = printMarginVertical;
                    RemoveAllSubLayers(GetLayerFromRoot(ParseLayerPath("IMAGE")));

                    //Reload current card as we just cleaned everything, this is ugly but it doesn't really matter
                    origCard = LoadImageIntoPosition("IMAGE", fullCardPath);
                    curCard = origCard;
                }

                //Place current card (need to check, we might have som issue with alpha and such regarding defining the bounds of the image)
                //alert("x:" + lastPosX + " - y:" + lastPosY + "\ncurX:" + curCard.bounds[0] + "curY:" + curCard.bounds[1])
                var XTranslate = lastPosX - curCard.bounds[0].value;
                var YTranslate = lastPosY - curCard.bounds[1].value;
                alert("lastPosX: " + lastPosX + "\ncurCard.bounds[0]: " + curCard.bounds[0] + "\nTanslate: [" + XTranslate + "," + YTranslate + "]");
                curCard.translate(XTranslate, YTranslate);      
                lastPosX = curCard.bounds[2];
            }
        }

    }

    var boardFileNumber = "_0";
    if(curCardBoardNb < 10)
    {
        boardFileNumber = "_00";
    }

    // Generateboard file name and export as png
    var exportBoardFile = exportBoardFoler + "/BoardFile" + boardFileNumber + curCardBoardNb + ".png";
    var saveFile = new File(exportBoardFile);
    var pngOpts = new PNGSaveOptions();
    pngOpts.interlaced = false;
    activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);

    // for(var i = 0; i < 10; i++)
    // {
    //     var curCard = LoadImageIntoPosition("IMAGE", "G:/Perso/Projects/PhotoshopScripts/Export/SKILL/SKILL_TEST01.png");
    //     var importWidth = curCard.bounds[2]; //[0] = X, [1] = Y, [2] = SizeX, [3] = SizeY; IN PIXELS

    //     if((lastPosX + importWidth) > docWidth)
    //     {
    //         lastPosX = 0;
    //         lastPosY = curCard.bounds[3];
    //     }

    //     curCard.translate(lastPosX, lastPosY);      
    //     lastPosX = curCard.bounds[2];
    // }
}

(function main()
{    
    //var testFile = File("G:/Perso/Projects/PhotoshopScripts/Export/SKILL/SKILL_TEST01.png");
    //var toto = open(testFile, OpenDocumentType.PNG, true);
    //var parsedCSV = new CSVData(filePath);

    var files = openDialog();
    for(var i = 0; i < files.length; i++)
    {
        var csvPath = files[i].fsName.replace(/\\/g, '/');
    //     //alert(csvPath);
        var parsedCSV = new CSVData(csvPath);
        GenerateCards(parsedCSV);
        GenerateCardsBoard(parsedCSV);
    }
    
})();
