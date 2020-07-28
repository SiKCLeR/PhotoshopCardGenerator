//alert('hello world');
//include "CSVParser.jsx"
//import "CSVParser.jsx"
var rootPath = app.activeDocument.path.fsName.replace(/\\/g, '/');
//#include test as string
//import CSVData from 'CSVParser'
// //@include 'CSVParser.jsx'
#include "D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/CSVParser.jsx"; // CS2 Requires full path
//#include "CSVParser.jsx"; // Later versions can reference script relatively to the current file
//#include test;
//alert(rootPath);
//alert(app.path.fsName)
//#include test
//#include "CSVParser.jsx"
//#include "CSVParser.jsx"
//#include "../CSVParser.jsx"

function ParseLayerPath(path)
{
    return path.split('/');
}

function GetLayer(curLayer, layerPathAr)
{
    var layerName = layerPathAr.shift();
    //var layer = curLayer.GetByName(layerName);

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

function GenerateCards(filePath)
{
    var parsedCSV = new CSVData(filePath);
    var entriesAct = [];
    var entriesPath = [];
    var cardID = "";

    for (var u = 0; u < parsedCSV.m_entryList.length; u++ ) 
    {
        for(var i = 0; i < parsedCSV.m_entryTypes.length; i++)
        {
            var entryTypeAr = parsedCSV.m_entryTypes[i].split('@');
            switch(entryTypeAr[0])
            {
                case "ID":
                    entriesPath = parsedCSV.m_entryList[u][i];
                    //alert("ID");
                    break;
                case "TEMPLATE":
                    //alert("TEMPLATE");
                    break;
                case "IMG":
                    //alert("IMG");
                    break;
                case "LAYER":
                    SetOnlyActiveLayer(entryTypeAr[1], parsedCSV.m_entryList[u][i]);
                    //alert("Layer Action Path: " + entryTypeAr[1] + "\nProp:" + parsedCSV.m_entryList[u][i]);
                    break;
                case "TEXT":
                    SetTextLayer(entryTypeAr[1], parsedCSV.m_entryList[u][i]);
                    //alert("Text Action Path: " + entryTypeAr[1] + "\nProp:" + parsedCSV.m_entryList[u][i]);
                    break;
                default:
                    //alert("Unknown action type")
                    break;
            }
        }
        var saveFile = new File("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Export/" + entriesPath + "_" + u +".png");
        var pngOpts = new PNGSaveOptions();
        pngOpts.interlaced = false;
        activeDocument.saveAs(saveFile, pngOpts, true, Extension.LOWERCASE);
        //app.activeDocument.saveAs(new File("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Export/Exported/"+u+".png"));
    }
    //alert(parsedCSV.m_entryTypes[0].split('_'));
}

(function main()
{
    app.open(new File(rootPath+"/Resources/CARD_STANDARD_TEMPLATE.psd"));
    app.activeDocument.close();
    
    //GenerateCards("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Cards Sheet.csv");
    
    //alert(app.path.fsName)
    //parsedCSV = new CSVData("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Cards Sheet.csv");
    //testCSVParser();
    //alert('hello world');
    //alert('hello world');
    //var testCSVData = new CSVData("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Cards Sheet.csv");
    //testCSVParser()
    //testCSVData.printCSVData();
    //app.activeDocument.layers[0].textItem.contents = testCSVData.m_entryList[0][2]
    /*var str = "";
    for(var x = 0; x < app.activeDocument.layers.length; x++)
    {
        str += app.activeDocument.layers[x].name + "\n";
    }
    alert(str);

    
    var l = app.activeDocument.GetByName("TITLE");
    alert(l.testItem.contents);*/
    // Function tests
    //SetTextLayer("TEST01/TEST02/TEST", "Lolilol");
    //SetOnlyActiveLayer("STYLE/AGILITY");
    //alert(testCSVData.m_entryTypes[0].split('_'));
    //alert(testCSVData.m_entryTypes);
    //alert(testCSVData.m_entryList);
})();


// var fs = new File("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/HelloWorld.txt");
// fs.open('r');

// var str = "";

// while(!fs.eof)
// {
//     str += fs.readln();
// }

// fs.close();


// app.activeDocument.layers[0].textItem.contents = str;
// app.activeDocument.layers[0].name = 'Toto';
