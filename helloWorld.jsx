//alert('hello world');
//#include "CSVParser.jsx"

function CSVData(_filePath)
{
    //this.filepath = _filePath;
    //this.entryTypes = null;
    this.entryList = [];

    var fs = new File(_filePath);
    fs.open('r');
    var curEntry = '';
    var curChar = '';
    var curEntryList = [];
    curChar += fs.readln();
    while(!fs.eof)
    {
        if(curChar == ',')
        {
            curEntryList.push(curEntry);
            curEntry = '';
        }
        else if(curChar == '\n')
        {
            curEntryList.push(curEntry);
            if(this.entryTypes == null)
            {
                this.entryTypes = curEntryList;
            }
            else 
            {
                this.entryList.length = this.entryList.length+1;
                this.entryList[this.entryList.length-1] = [];
                this.entryList[this.entryList.length-1].push(curEntry);
            }
            curEntry = "";
            curEntryList = [];
        }
        else 
        {
            
        }
        curChar += fs.readln();
    }
    fs.close()
}

CSVData.prototype.printCSVData = function()
{
    prtInfos = 'Entries Titles\n';
    for(et in this.entryTypes)
    {
        prtInfos += et + '|';
    }
    prtInfos += '\n';
    for(el in this.entryList)
    {
        for(e in el)
        {
            prtInfos += e + '|';
        }
        prtInfos += '\n';
    }
    alert(prtInfos);
}

(function main()
{
    //testCSVParser();
    //alert('hello world');
    var testCSVData = new CSVData("D:/Projets/Les_Mondes_D_Olim/PhotoshopScript/Ressources/Les Mondes d'Olim - Creatures.csv")
    testCSVData.printCSVData()
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
