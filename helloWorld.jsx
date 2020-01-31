//alert('hello world');
//include "CSVParser.jsx"
//import "CSVParser.jsx"
#include "D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/CSVParser.jsx"

(function main()
{
    //testCSVParser();
    //alert('hello world');
    //alert('hello world');
    var testCSVData = new CSVData("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Creatures.csv");
    //testCSVParser()
    //testCSVData.printCSVData();
    app.activeDocument.layers[0].textItem.contents = testCSVData.m_entryList[0][2]
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
