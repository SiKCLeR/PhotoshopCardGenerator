//alert('hello world');
//include "CSVParser.jsx"
//import "CSVParser.jsx"
#include "D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/CSVParser.jsx"
//#include "CSVParser.jsx"
//#include "../CSVParser.jsx"
function GenerateCards(filePath)
{
    var testCSVData = new CSVData("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Cards Sheet.csv");
    var entriesAct = [];
    var entriesPath = [];
    alert(testCSVData.m_entryTypes)
    for(t in testCSVData.m_entryTypes)   
    {
        var rawTypeData = t.split('_');
        entriesAct.push(rawTypeData[0]);
        var curEntryPath = [];
        
        for(var i = 1; i < rawTypeData.length; i++)
        {
            curEntryPath.push(rawTypeData[i]);
        }
        entriesPath.push(curEntryPath);
    }

    //for(a in entriesAct)
    //{
        alert(entriesAct);
    //}

    for (e in testCSVData.m_entryList) 
    {
        for(a in entriesAct)
        {
            switch(a)
            {
                case "ID":
                    alert("ID");
                    break;
                case "TEMPLATE":
                    alert("TEMPLATE");
                    break;
                case "IMG":
                    alert("IMG");
                    break;
                case "LAYER":
                    alert("LAYER");
                    break;
                case "TEXT":
                    alert("TEXT");
                    break;
                default:
                    alert("Unknown action type")
                    break;
            }
        }
    }
    alert(testCSVData.m_entryTypes[0].split('_'));
}

(function main()
{
    //testCSVParser();
    //alert('hello world');
    //alert('hello world');
    var testCSVData = new CSVData("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Cards Sheet.csv");
    //testCSVParser()
    //testCSVData.printCSVData();
    //app.activeDocument.layers[0].textItem.contents = testCSVData.m_entryList[0][2]
    alert(testCSVData.m_entryTypes[0].split('_'));
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
