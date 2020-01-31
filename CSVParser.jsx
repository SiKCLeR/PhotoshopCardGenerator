function CSVData(_filePath) // Class definition (yup it's weird in JSX)
{
    // Class variables
    this.m_entryTypes = null;
    this.m_entryList = [];

    var fs = new File(_filePath);
    fs.open('r');
    var curEntry = '';
    var curChar = '';
    var curEntryList = [];
    curChar += fs.readch();

    while(!fs.eof)
    {
        if(curChar == ',') // Next Entry
        {
            curEntryList.push(curEntry);
            curEntry = '';
        }
        else if(curChar == '\n') // Next Line
        {
            curEntryList.push(curEntry);
            if(this.m_entryTypes == null)
            {
                this.m_entryTypes = curEntryList;
            }
            else 
            {
                alert(curEntryList.length)
                //this.m_entryList.push([]);
                //this.m_entryList[this.m_entryList.length-1] = curEntryList;
                this.m_entryList[this.m_entryList.length] = curEntryList;
            }
            curEntry = '';
            curEntryList = [];
        }
        else // Else keep feeling the current entry
        {
            curEntry += curChar;
        }
        curChar = fs.readch();
    }

    if(curEntry != "")
    {
        curEntryList.push(curEntry);
        this.m_entryList[this.m_entryList.length] = curEntryList;
        //this.m_entryList.push([]);
        //this.m_entryList[this.m_entryList.length-1].push(curEntryList);
    }

    //alert(curEntry)
    fs.close();
    //alert(this.m_entryTypes)
    //alert(this.m_entryList.length);
    //alert(this.m_entryList[0].length);
};

CSVData.prototype.printCSVData = function()
{
    //alert(this.m_entryTypes)
    prtInfos = 'Entries Titles:\n';
    for(var et in this.m_entryTypes)
    {
        prtInfos += this.m_entryTypes[et] + '|';
    }
    prtInfos += '\n';
    for(var el in this.m_entryList)
    {
        for(var e in this.m_entryList[el])
        {
            prtInfos += this.m_entryList[el][e] + '|';
        }
        prtInfos += '\n';
    }
    alert(prtInfos);
};