#include "CSVParser.jsx"; // Only works with recent versions of CS, doesn't work with CS2

var rootPath;// = app.activeDocument.path.fsName.replace(/\\/g, '/');
var rootName;

function ImagePosInfos() // Class definition (yup it's weird in JSX)
{
    // Class variables
    this.m_imagePos = null;
    this.m_imagePath = null;
};

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
    if(layer != undefined)
    {
        layer.textItem.contents = text;
    }
}

function SetOnlyActiveLayer(layerParentPath, onlyActiveName)
{
    var parentLayer = GetLayerFromRoot(ParseLayerPath(layerParentPath));
    if(parentLayer != undefined)
    {
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
}

function LoadImageIntoLayerSet(layerSetPath, imagePath)
{
    var mainDoc = activeDocument;
    var folderLayer = GetLayerFromRoot(ParseLayerPath(layerSetPath));

    if(folderLayer != undefined)
    {
        var loadedFile = new File(imagePath);
        var importDoc = open(loadedFile);

        var importedLayer = importDoc.artLayers[0].duplicate(mainDoc);
        app.activeDocument = mainDoc;
        importDoc.close();

        importedLayer.name = "TMP_IMAGE";
        importedLayer.move(folderLayer, ElementPlacement.INSIDE);
        return importedLayer;
    }
    return undefined;
}

function GenerateCards(parsedCSV)
{
    var cardID = "";
    var exportCategory = "";

    for (var u = 0; u < parsedCSV.m_entryList.length; u++ ) 
    {
        var exportFolderCat = rootPath;

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
                    try
                    {
                        if(app.activeDocument.fullName.fsName.replace(/\\/g, '/').toLowerCase() != templatePath.toLowerCase())
                        {
                            app.open(new File(templatePath));
                        }
                    }
                    catch(error)
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
                    SetTextLayer(entryTypeAr[1], parsedCSV.m_entryList[u][i].replace(/(?:\r\n|\n)/g, '\r'));
                    break;
                case "CATEGORY":
                    exportCategory = entryTypeAr[1] + "/" + parsedCSV.m_entryList[u][i];
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

function LoadImageIntoLayerSet(layerSetPath, imagePath)
{
    var mainDoc = activeDocument;
    var folderLayer = GetLayerFromRoot(ParseLayerPath(layerSetPath));

    if(folderLayer != undefined)
    {
        var loadedFile = new File(imagePath);
        var importDoc = open(loadedFile);

        var importedLayer = importDoc.artLayers[0].duplicate(mainDoc);
        app.activeDocument = mainDoc;
        importDoc.close();

        importedLayer.name = "TMP_IMAGE";
        importedLayer.move(folderLayer, ElementPlacement.INSIDE);
        return importedLayer;
    }
    return undefined
}

function RemoveAllSubLayers(curLayer)
{
    for(var i = (curLayer.layers.length - 1); i > -1; i--)
    {
        curLayer.layers[i].remove();
    }
}

function GeneradeCardsBoardFromCardInfoList(_cardInfoList, _saveBackFile)
{
    var prevCard = "";
    var prevLayer;

    for(var i = 0; i < _cardInfoList.length; i++)
    {
        var curCard;
        if(_cardInfoList[i].m_imagePath != prevCard)
        {
            curCard = LoadImageIntoLayerSet("IMAGE", _cardInfoList[i].m_imagePath);
            prevCard = _cardInfoList[i].m_imagePath;
        }
        else
        {
            curCard = prevLayer.duplicate();
        }
        var XTranslate = _cardInfoList[i].m_imagePos[0] - curCard.bounds[0].value;
        var YTranslate = _cardInfoList[i].m_imagePos[1] - curCard.bounds[1].value;
        curCard.translate(XTranslate, YTranslate); 
        prevLayer = curCard;
    }

    var pngOpts = new PNGSaveOptions();
    pngOpts.interlaced = false;
    activeDocument.saveAs(_saveBackFile, pngOpts, true, Extension.LOWERCASE);

    RemoveAllSubLayers(GetLayerFromRoot(ParseLayerPath("IMAGE")));
}

function GenerateFrontBackPDF(inputFiles, exportPath)
{
    var outputFile = File(exportPath);   

    var pdfOptions = new PDFSaveOptions;
    pdfOptions.downSample = PDFResample.NONE;
    pdfOptions.encoding = PDFEncoding.JPEG;
    pdfOptions.jpegQuality = 12; //12 is maximum

    var options = new PresentationOptions;  
    options.presentation = false; 
    options.PDFFileOptions = pdfOptions;
    app.makePDFPresentation(inputFiles, outputFile, options);   
}

function GenerateCardsBoard(parsedCSV)
{
    var exportBoardFolder = rootPath + "/Boards";
    var boardFolder = Folder(exportBoardFolder);
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
    var backImageInfos = [];
    var allImageFiles = [];

    for (var u = 0; u < parsedCSV.m_entryList.length; u++ ) 
    {
        var backImgPath = "";
        for(var i = 0; i < parsedCSV.m_entryTypes.length; i++)
        {
            var entryTypeAr = parsedCSV.m_entryTypes[i].split('@');
            //var loadedImage;

            switch(entryTypeAr[0])
            {
                case "ID":
                    cardID = parsedCSV.m_entryList[u][i];
                    break;
                case "CATEGORY":
                    exportCategory = entryTypeAr[1] + "/" + parsedCSV.m_entryList[u][i];
                    break;
                case "QUANTITY":
                    var cardQtty = parsedCSV.m_entryList[u][i];
                    break;
                case "BACK":                    
                    backImgPath = rootPath + "/" + entryTypeAr[1] + "/" + parsedCSV.m_entryList[u][i] + ".png";
                    break;
                default:
                    break;
            }
        }

        //var cardFolderCat = exportFolderCat + "/" + exportCategory;
        var fullCardPath = rootPath + "/" + exportCategory + "/" + cardID + ".png";
        var lastCard;

        if(cardQtty > 0)
        {
            var origCard = LoadImageIntoLayerSet("IMAGE", fullCardPath);

            var origX = origCard.bounds[0];
            var origY = origCard.bounds[1];
            if(origX != 0 || origY != 0)
            {
                origCard.translate(-origX, -origY);
            }

            var importWidth = origCard.bounds[2].value; //[0] = X, [1] = Y, [2] = SizeX, [3] = SizeY; IN PIXELS
            var importHeight = origCard.bounds[3].value; //[0] = X, [1] = Y, [2] = SizeX, [3] = SizeY; IN PIXELS
            var curCard = origCard;

            for(var q = 0; q < cardQtty; q++)
            {
                if(q > 0)
                {
                    curCard = origCard.duplicate();
                }

                if((lastPosX + importWidth) > (docWidth - (2*printMarginHorizontal)))
                {
                    lastPosX = printMarginHorizontal;
                    lastPosY = lastCard.bounds[3];
                }

                // If we don't have anymore space in this board
                if((lastPosY + importHeight) > (docHeight - (2*printMarginVertical)))
                {
                    // We don't anticipate (need to refactor the code) so we realise too late that we don't have space for another card
                    curCard.remove();

                    // Generate clean board number (format: _XXX)
                    var boardFileNumber = "_0";
                    if(curCardBoardNb < 10)
                    {
                        boardFileNumber = "_00";
                    }

                    // Generateboard file name and export as png
                    var exportBoardFile = exportBoardFolder + "/BoardFile_" + rootName + boardFileNumber + curCardBoardNb + ".png";
                    var saveFile = new File(exportBoardFile);
                    var pngOpts = new PNGSaveOptions();
                    pngOpts.interlaced = false;
                    activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);

                    // Clean all current content
                    RemoveAllSubLayers(GetLayerFromRoot(ParseLayerPath("IMAGE")));

                    // Generate back images
                    var exportBoardBackFile = exportBoardFolder + "/BoardFile_" + rootName + boardFileNumber + curCardBoardNb + "_BACK.png";
                    var saveBackFile = new File(exportBoardBackFile);
                    GeneradeCardsBoardFromCardInfoList(backImageInfos, saveBackFile); // Generate back of cards
                    backImageInfos = [];

                    // Generated PDF with front and back matching for easy printing
                    var pdfFrontBackPath = exportBoardFolder + "/BoardFile_" + rootName + boardFileNumber + curCardBoardNb + ".pdf";
                    GenerateFrontBackPDF([saveFile, saveBackFile], pdfFrontBackPath);
                    allImageFiles.push(saveFile);
                    allImageFiles.push(saveBackFile);

                    // Update board number, clean positions and all current content
                    curCardBoardNb += 1;
                    lastPosX = printMarginHorizontal;
                    lastPosY = printMarginVertical;

                    //Reload current card as we just cleaned everything, this is ugly but it doesn't really matter
                    origCard = LoadImageIntoLayerSet("IMAGE", fullCardPath);
                    curCard = origCard;
                }

                var XTranslate = lastPosX - curCard.bounds[0].value;
                var YTranslate = lastPosY - curCard.bounds[1].value;

                curCard.translate(XTranslate, YTranslate);  
                lastPosX = curCard.bounds[2];
                lastCard = curCard;

                if (backImgPath != "") 
                {
                    var imagePos = [((docWidth - curCard.bounds[0].value) - importWidth), curCard.bounds[1].value];
                    var backImg = new ImagePosInfos();
                    backImg.m_imagePos = imagePos;
                    backImg.m_imagePath = backImgPath;
                    backImageInfos.push(backImg);
                }
            }
        }

    }

    var boardFileNumber = "_0";
    if(curCardBoardNb < 10)
    {
        boardFileNumber = "_00";
    }

    // Generateboard file name and export as png
    var exportBoardFile = exportBoardFolder + "/BoardFile_" + rootName + boardFileNumber + curCardBoardNb + ".png";
    var saveFile = new File(exportBoardFile);
    var pngOpts = new PNGSaveOptions();
    pngOpts.interlaced = false;
    activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);
    
    if(backImageInfos.length > 0)
    {        
        RemoveAllSubLayers(GetLayerFromRoot(ParseLayerPath("IMAGE")));
        var exportBoardBackFile = exportBoardFolder + "/BoardFile_" + rootName + boardFileNumber + curCardBoardNb + "_BACK.png";
        var saveBackFile =  new File(exportBoardBackFile);
        GeneradeCardsBoardFromCardInfoList(backImageInfos, saveBackFile);

        var pdfFrontBackPath = exportBoardFolder + "/BoardFile_" + rootName + boardFileNumber + curCardBoardNb + ".pdf";
        GenerateFrontBackPDF([saveFile, saveBackFile], pdfFrontBackPath);
        allImageFiles.push(saveFile);
        allImageFiles.push(saveBackFile);
    }

    if(allImageFiles.length > 0)
    {
        var pdfAllFilesPath = exportBoardFolder + "/BoardFile_" + rootName + "_ALL.pdf";
        GenerateFrontBackPDF(allImageFiles, pdfAllFilesPath);
    }
}

(function main()
{ 
    /*var myWindow = new Window ("dialog");
    var myMessage = myWindow.add ("statictext");
    myMessage.text = "Hello, world!";
    myWindow.show ( );*/

    var files = openDialog();
    for(var i = 0; i < files.length; i++)
    {
        var csvPath = files[i].fsName.replace(/\\/g, '/');
        rootPath = files[i].path.replace(/\\/g, '/');
        rootName = files[i].name.replace(/%20/g,' ').split(".")[0];

        var parsedCSV = new CSVData(csvPath);
        GenerateCards(parsedCSV);
        GenerateCardsBoard(parsedCSV);
    }
    
})();
