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
            if(curEntryList.length > 0) // Sometimes we have multiple \n back to back (I don't know why)
            {
                curEntryList.push(curEntry);
                if(this.m_entryTypes == null)
                {
                    this.m_entryTypes = curEntryList;
                }
                else 
                {
                    this.m_entryList[this.m_entryList.length] = curEntryList;
                }
                curEntry = '';
                curEntryList = [];
            }
        }
        else // Else keep filling the current entry
        {
            curEntry += curChar;
        }
        curChar = fs.readch();
    }

    if(curEntry != "")
    {
        curEntryList.push(curEntry);
        this.m_entryList[this.m_entryList.length] = curEntryList;
    }

    fs.close();
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