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
    var inQuineBrackets = false;
    curChar += fs.readch();

    while(!fs.eof)
    {
        if(curChar == '"')
        {
            inQuineBrackets = !inQuineBrackets;
        }
        else if(!inQuineBrackets && curChar == ',') // Next Entry
        {
            curEntryList.push(curEntry);
            curEntry = '';
        }
        else if(!inQuineBrackets && curChar == '\n') // Next Line
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

    if(curEntry != "") //Push last entry if the file ends in the middle of it (would be weird)
    {
        curEntryList.push(curEntry);        
    }

    if(curEntryList.length > 0) //Add last entry list if its not empty (happens when eof is at the end of the last entry)
    {
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