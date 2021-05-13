var da, gnMetaMaskOK, gobjContract_Roulette, gsUserETHAccount, gsCurrentNetwork, gnUserETHBalance, gsFormattedUserETHBalance, gnGasPrice, gsLastTxHash, gnTimerCountdown, gobjTimerCountdown, garrHouses
var gsaSingles, gsaThirds, gsaColumns, gbaAllSpaces, gnHouseBalance, gnHouseMaxPayoutPerSpin, gbSendtransactionError, gnPublicMaxPayoutPerSpin, gnSpin_WinningNumber
var gnSpin_WinningNumber
var gsGoodMetamaskNetwork = "kovan"
var gnGoodNetworkID = 42
var gsNetwork_prefix = "kovan."
var gsNetwork_Name = "Kovan"
var gcsContractAddress_Roulette = "0x7b7e6EA61cCF498e1066AD8954Db8E275Bb4835F";
var gcnEthToTokenMultiplier = 1000

var gnBaseChipValue = .001;

var gnaBetClick = [, [619, 344], [932, 344], [1246, 344], [552, 401], [701, 401], [855, 401], [1012, 401], [1169, 401], [1323, 401], [426, 242], [426, 97],  
    [502, 266], [502, 169], [502, 72],
    [580, 266], [580, 169], [580, 72],
    [658, 266], [658, 169], [658, 72],
    [736, 266], [736, 169], [736, 72],
    [814, 266], [814, 169], [814, 72],
    [892, 266], [892, 169], [892, 72],
    [970, 266], [970, 169], [970, 72],
    [1048, 266], [1048, 169], [1048, 72],
    [1128, 266], [1128, 169], [1128, 72],
    [1206, 266], [1206, 169], [1206, 72],
    [1284, 266], [1284, 169], [1284, 72],
    [1362, 266], [1362, 169], [1362, 72],
    [1440, 266], [1440, 169], [1440, 72],
]

var gcnRedNumbers = [1,3,5,7,9,12,14,16,18,21,23,25,27,28,30,32,34,36]
var gnaSpacesClicked = []

var gsaBetDescriptions = ['', "1st 12", "2nd 12", "3rd 12", "1-18", "Even", "Red", "Black", "Odd", "19-36", "0", "00", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
    "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "Left column", "Middle column", "Right column"]

function DoGetPayout(nWinningNumber, nBetID) {
    var nPayout = 0

    // One number
    if (nWinningNumber < 37 && nBetID - 11 == nWinningNumber) {
        nPayout = 36
    }
    if (nWinningNumber > 36 && nBetID + 27 == nWinningNumber) {
        nPayout = 36
    }

    // 1st, 2nd, and 3rd 12
    if (nBetID == 1 && nWinningNumber < 13) {
        nPayout = 3
    }
    if (nBetID == 2 && nWinningNumber > 12 && nWinningNumber < 25) {
        nPayout = 3
    }
    if (nBetID == 3 && nWinningNumber > 24 && nWinningNumber < 37) {
        nPayout = 3
    }

    // 1-18; 19-36
    if (nBetID == 4 && nWinningNumber < 19) {
        nPayout = 2
    }
    if (nBetID == 9 && nWinningNumber > 18 && nWinningNumber < 37) {
        nPayout = 2
    }

    // Even, Odd
    if (nBetID == 5 && nWinningNumber < 37 && nWinningNumber % 2 == 0) {
        nPayout = 2
    }
    if (nBetID == 8 && nWinningNumber < 37 && nWinningNumber % 2 == 1) {
        nPayout = 2
    }

    // Red, Black
    if (nBetID == 6 && gcnRedNumbers.indexOf(nWinningNumber) != -1) {
        nPayout = 2
    }
    if (nBetID == 7 && nWinningNumber < 37 && gcnRedNumbers.indexOf(nWinningNumber) == -1) {
        nPayout = 2
    }

    // 3 Columns    
    if (nBetID == 48 && nWinningNumber < 37 && (nWinningNumber - 1) % 3 == 0) {
        nPayout = 3
    }
    if (nBetID == 49 && nWinningNumber < 37 && (nWinningNumber - 2) % 3 == 0) {
        nPayout = 3
    }
    if (nBetID == 50 && nWinningNumber < 37 && nWinningNumber % 3 == 0) {
        nPayout = 3
    }
    return nPayout
}

async function DoCreateNewHouse() {
    await DoRefreshMetamask()
    if (gnMetaMaskOK == 0) {
        return
    }
    setTimeout(function () { DoCreateNewHouse2() }, 200)
}

async function DoCreateNewHouse2() {
    var sUsername = da.idTxtNewHouse_Username.value.trim()
    var nDeposit = Math.round(da.idTxtNewHouse_Deposit.value * 100)/100
    var nMaxPayoutPerSpin = Math.round(da.idTxtNewHouse_MaxPayoutPerSpin.value * 100) / 100

    if (isNaN(nDeposit)) { nDeposit = 0 }
    if (isNaN(nMaxPayoutPerSpin)) { nMaxPayoutPerSpin = 0 }
    if (sUsername == '' || nDeposit <= 0 || nMaxPayoutPerSpin <= 0) {
        alert("Please complete the three textboxes.")
        return
    }
    if (nDeposit > gnUserETHBalance - .01) {
        alert("You may not deposit more Tokens than your Balance (minus the gas fees).")
        return
    }
    if (nMaxPayoutPerSpin > nDeposit) {
        alert("The 'Maximum Payout Per Spin' may not be greater than your Deposit.")
        return
    }

    // Check for duplicate Username
    nIsDup = 0
    for (nIndex = 0; nIndex < garrHouses.length; nIndex++) {
        if (garrHouses[nIndex].sUsername.toLowerCase() == sUsername.toLowerCase()) {
            nIsDup = 1
            break
        }
    }

    if (nIsDup == 1) {
        alert("That House Username has alrady been used.")
        return
    }

    var nValue = web3.utils.toWei(String(DoSafeDecimals(nDeposit * gnBaseChipValue)))
    var nMaxPayoutPerSpin = web3.utils.toWei(String(nMaxPayoutPerSpin))
    var objData = gobjContract_Roulette.methods.zCreateHouse(
        web3.utils.asciiToHex(sUsername),
        nMaxPayoutPerSpin
    ).encodeABI()
    await DoSendSignedTransaction(objData, nValue, gcsContractAddress_Roulette);
    DoReloadPage()
}

function AlphaNumeric(e) {
    var n = window.event ? e.keyCode : e.which
    if (!((n >= 65 && n <= 90) || (n >= 48 && n <= 57) || (n >= 97 && n <= 122) || n == 0 || n == 8 || n == 95)) { return false }
}

function NumericOnly(e) {
    var n = window.event ? e.keyCode : e.which
    if (!((n >= 48 && n <= 57) || n == 46 || n == 0 || n == 8)) { return false }
}

function DoCalculatePayout() {
    var nIndex
    var nPayout = 0
    var nWinningNumber = 20

    // One number
    if (nWinningNumber < 37 && gbaAllSpaces[nWinningNumber + 11]) {
        nPayout += 36;
    }
    if (nWinningNumber > 36 && gbaAllSpaces[nWinningNumber - 27]) {
        nPayout += 36;
    }

    // 1st, 2nd, and 3rd 12
    if (gbaAllSpaces[1] && nWinningNumber < 13) {
        nPayout += 2;
    }
    if (gbaAllSpaces[2] && nWinningNumber > 12 && nWinningNumber < 25) {
        nPayout += 2;
    }
    if (gbaAllSpaces[3] && nWinningNumber > 24 && nWinningNumber < 37) {
        nPayout += 2;
    }

    // 1-18; 19-36
    if (gbaAllSpaces[4] && nWinningNumber < 19) {
        nPayout++;
    }
    if (gbaAllSpaces[9] && nWinningNumber > 18 && nWinningNumber < 37) {
        nPayout++;
    }

    // Even, Odd
    if (gbaAllSpaces[5] && nWinningNumber < 37 && nWinningNumber % 2 == 0) {
        nPayout++;
    }
    if (gbaAllSpaces[8] && nWinningNumber < 37 && nWinningNumber % 2 == 1) {
        nPayout++;
    }

    // Red, Black
    if (gbaAllSpaces[6] && gcnRedNumbers.indexOf(nWinningNumber) != -1) {
        nPayout++;
    }
    if (gbaAllSpaces[7] && nWinningNumber < 37 && gcnRedNumbers.indexOf(nWinningNumber) == -1) {
        nPayout++;
    }

    // 3 Columns    
    if (gbaAllSpaces[48] && nWinningNumber < 37 && (nWinningNumber - 1) % 3 == 0) {
        nPayout++;
    }
    if (gbaAllSpaces[49] && nWinningNumber < 37 && (nWinningNumber - 2) % 3 == 0) {
        nPayout++;
    }
    if (gbaAllSpaces[50] && nWinningNumber < 37 && nWinningNumber % 3 == 0) {
        nPayout++;
    }
}

async function DoLoad() {
    var urlParams = new URLSearchParams(window.location.search);
    var sHouseUsername = urlParams.get('house');

    da = document.all
    await DoHardMetamaskRefresh()
}

function DoSubdivideArrays() {
    var nIndex
    gsaSingles = gnaSpacesClicked.filter(function (element) {
        return element >= 10 && element <= 47;
    });

    gsaThirds = gnaSpacesClicked.filter(function (element) {
        return element < 4;
    });

    gsaColumns = gnaSpacesClicked.filter(function (element) {
        return element > 47;
    });

    gbaAllSpaces = []
    for (nIndex = 0; nIndex < 51; nIndex++) {
        gbaAllSpaces.push(false)
    }
    for (nIndex = 0; nIndex < gnaSpacesClicked.length; nIndex++) {
        gbaAllSpaces[gnaSpacesClicked[nIndex]] = true
    }
}

function DoChangeCmbChipValue() {
    var nIndex, objElement
    for (nIndex = 0; nIndex < gnaSpacesClicked.length; nIndex++) {
        objElement = document.getElementById("idImgChip_" + gnaSpacesClicked[nIndex]);
        objElement.parentNode.removeChild(objElement);
    }

    gnaSpacesClicked = []
    DoCalculateMaxProfit()
}

function DoCalculateMaxProfit() {
    var nMaxProfit = 0
    DoSubdivideArrays()
    if (gsaSingles.length > 0) {
        nMaxProfit += 35
        nMaxProfit -= gsaSingles.length - 1
    }
    if (gsaThirds.length > 0) {
        nMaxProfit += 2
        nMaxProfit -= gsaThirds.length - 1
    }
    if (gsaColumns.length > 0) {
        nMaxProfit += 2
        nMaxProfit -= gsaColumns.length - 1
    }

    if ((gbaAllSpaces[4] || gbaAllSpaces[9]) && !(gbaAllSpaces[4] && gbaAllSpaces[9])) { nMaxProfit++ }
    if ((gbaAllSpaces[5] || gbaAllSpaces[8]) && !(gbaAllSpaces[5] && gbaAllSpaces[8])) { nMaxProfit++ }
    if ((gbaAllSpaces[6] || gbaAllSpaces[7]) && !(gbaAllSpaces[6] && gbaAllSpaces[7])) { nMaxProfit++ }

    nMaxProfit = DoSafeDecimals(nMaxProfit * da.idCmbChipValue.value)
    da.idSpanCurrentMaximumPayout.innerHTML = "&nbsp;" + nMaxProfit + "&nbsp;"
    return nMaxProfit
}

async function DoHardMetamaskRefresh() {
    await DoRefreshMetamask()
    if (gnMetaMaskOK == 1) {
        DoDisplayWorkingSplash()
        await DoShowDataFromContract()
        da.idDivAllDivs.style.display = "inline"
        da.divOverlay_Working.style.display = 'none';
    }
}

async function DoShowDataFromContract() {
    var nIndex, sHTML, nData_Balance, nData_MaxPayoutPerSpin, sData_Address, sData_Username, urlParams, sComboboxIndex_house, sComboboxIndex_chip, nIndex2
    garrHouses = []

    var objHouses = await gobjContract_Roulette.methods.zGetHouses().call()
    for (nIndex = 1; nIndex < objHouses.anBalances.length; nIndex++) {
        nData_Balance = DoSafeDecimals(web3.utils.fromWei(objHouses.anBalances[nIndex]) * gcnEthToTokenMultiplier)
        nData_MaxPayoutPerSpin = web3.utils.fromWei(objHouses.anMaxPayoutPerSpins[nIndex])
        sData_Address = objHouses.asAddresses[nIndex]
        sData_Username = web3.utils.toUtf8(objHouses.asUsernames[nIndex])
        if (nData_Balance < nData_MaxPayoutPerSpin) {
            nData_MaxPayoutPerSpin = nData_Balance
        }
        if (nData_Balance > 0) {
            garrHouses.push({
                nHouseID: nIndex,
                nBalance: nData_Balance,
                nMaxPayoutPerSpin: nData_MaxPayoutPerSpin,
                sAddress: sData_Address,
                sUsername: sData_Username
            })
        }

        if (sData_Address.toLowerCase() == gsUserETHAccount.toLowerCase()) {
            gnHouseBalance = nData_Balance
            gnHouseMaxPayoutPerSpin = nData_MaxPayoutPerSpin
            da.idSpanHouseSettings.innerHTML = `
            <table width=98% cellpadding=0 cellspacing=0><tr>
            <td><b><font color=maroon>Your House Balance</font>: ` + nData_Balance + `</b></td>
            <td align=center><a class=bluelink href='javascript:DoShowHouseReport()'><b>Detailed House Report</b></a></td>
            <td align=right><b>Your House URL:</b> <input type=text readonly onclick='this.select()' style='width:480px;background:#ffd0ff' value=https://predictionwagers.github.io/Roulette/?house=` +
            sData_Username + `></td></tr></table>
			House Username (12 chars): <input type=text maxlength=12 id=idTxtEditHouse_Username style='width:120px' onKeyPress='return AlphaNumeric(event)' value=` + sData_Username + `>
			&nbsp;Maximum Payout Per Spin: <input type=text maxlength=6 id=idTxtEditHouse_MaxPayoutPerSpin style='width:60px' onKeyPress='return NumericOnly(event)' value=` + nData_MaxPayoutPerSpin + `>
			&nbsp;Tokens to Deposit: <input type=text maxlength=6 id=idTxtEditHouse_Deposit style='width:60px' onKeyPress='return NumericOnly(event)'>
			&nbsp;Tokens to Withdraw: <input type=text maxlength=6 id=idTxtEditHouse_Withdrawal style='width:60px' onKeyPress='return NumericOnly(event)'>
			<br><input type=button value='Update Your House Account' onClick=DoUpdateHouse() style='font-size:14px;background:navy;color:white;font-weight:bold'>
            `
        }
    }
    garrHouses.sort((a, b) => (a.nBalance < b.nBalance) ? 1 : -1)

    sHTML = ""
    for (nIndex = 0; nIndex < garrHouses.length; nIndex++) {
        if (garrHouses[nIndex].nBalance > 0) {
            sHTML += "<option value=" + garrHouses[nIndex].nHouseID + ">" + garrHouses[nIndex].sUsername + "; Balance: " + garrHouses[nIndex].nBalance + "; Maximum Payout Per Spin: " + garrHouses[nIndex].nMaxPayoutPerSpin + "</option>"
            gnPublicMaxPayoutPerSpin = garrHouses[nIndex].nMaxPayoutPerSpin
        }
    }
    da.idSpanHouses.innerHTML = "<select id=idCmbHouse>" + sHTML + "</select>"

// If incoming parameters, set combo boxes
    urlParams = new URLSearchParams(window.location.search);
    sComboboxIndex_house = urlParams.get('house');
    sComboboxIndex_chip = urlParams.get('chip');
    if (sComboboxIndex_house) {
        for (nIndex = 0; nIndex < garrHouses.length; nIndex++) {
            if (garrHouses[nIndex].nBalance > 0 && sComboboxIndex_house.toLowerCase() == garrHouses[nIndex].sUsername.toLowerCase()) {
                for (nIndex2 = 0; nIndex2 < da.idCmbHouse.options.length; nIndex2++) {
                    if (da.idCmbHouse.options[nIndex2].value == garrHouses[nIndex].nHouseID) {
                        da.idCmbHouse.selectedIndex = nIndex2
                        break;
                    }
                }
                break;
            }
        }
    }
    if (sComboboxIndex_chip) {
        da.idCmbChipValue.value = sComboboxIndex_chip
    }
}

async function DoUpdateHouse() {
    await DoRefreshMetamask()
    if (gnMetaMaskOK == 0) {
        return
    }
    setTimeout(function () { DoUpdateHouse2() }, 200)
}

async function DoUpdateHouse2() {
    var nIndex, nIsDup

    var sUsername = da.idTxtEditHouse_Username.value.trim()
    var nDeposit = Math.round(da.idTxtEditHouse_Deposit.value * 100) / 100
    var nWithdrawal = Math.round(da.idTxtEditHouse_Withdrawal.value * 100) / 100
    var nMaxPayoutPerSpin = Math.round(da.idTxtEditHouse_MaxPayoutPerSpin.value * 100) / 100

    if (isNaN(nDeposit)) { nDeposit = 0 }
    if (isNaN(nWithdrawal)) { nDeposit = 0 }
    if (isNaN(nMaxPayoutPerSpin)) { nMaxPayoutPerSpin = 0 }
    if (sUsername == '' || nMaxPayoutPerSpin <= 0) {
        alert("Please complete the first two textboxes.")
        return
    }
    if (nDeposit > gnUserETHBalance - .01) {
        alert("You may not deposit more Tokens than your Token Balance (minus the gas fees).")
        return
    }
    if (nMaxPayoutPerSpin > gnHouseBalance) {
        alert("The 'Maximum Payout Per Spin' may not be greater than your House Balance.")
        return
    }
    if (nWithdrawal > gnHouseBalance) {
        alert("You may not Withdraw more than your House Balance.")
        return
    }

    // Check for duplicate Username
    nIsDup = 0
    for (nIndex = 0; nIndex < garrHouses.length; nIndex++) {
        if (garrHouses[nIndex].sAddress.toLowerCase() != gsUserETHAccount.toLowerCase() && garrHouses[nIndex].sUsername.toLowerCase() == sUsername.toLowerCase()) {
            nIsDup = 1
            break
        }
    }

    if (nIsDup == 1) {
        alert("That House Username has alrady been used.")
        return
    }

    var nValue = web3.utils.toWei(String(DoSafeDecimals(nDeposit * gnBaseChipValue)))
    var nMaxPayoutPerSpin = web3.utils.toWei(String(nMaxPayoutPerSpin))
    var nWithdrawal = web3.utils.toWei(String(DoSafeDecimals(nWithdrawal * gnBaseChipValue)))
    var objData = gobjContract_Roulette.methods.zUpdateHouse(
        web3.utils.asciiToHex(sUsername),
        nMaxPayoutPerSpin,
        nWithdrawal
    ).encodeABI()
    await DoSendSignedTransaction(objData, nValue, gcsContractAddress_Roulette);
    DoReloadPage()

}

function DoReloadPage() {
    var nIndex, sHouse
    for (nIndex = 0; nIndex < garrHouses.length; nIndex++) {
        if (garrHouses[nIndex].nHouseID == da.idCmbHouse.value) {
            sHouse = garrHouses[nIndex].sUsername
            break
        }
    }

    window.location.href = "?house=" + sHouse + "&chip=" + da.idCmbChipValue.value
}

window.onclick = function (event) {
    if (event.target == da.divOverlay_HouseReport) {
        DoCloseHouseReport()
    }
    if (event.target == da.divOverlay_SpinReport) {
        DoCloseSpinReport()
    }
}

function DoCloseHouseReport() {
    da.divOverlay_HouseReport.style.display = 'none';
}

function DoCloseSpinReport() {
    DoReloadPage()
}

async function DoShowHouseReport() {
    var objEvents, nIndex, nData_CreditOrDebit, sData_PlayerAddress, sData_TimeStamp, sTableData
    await gobjContract_Roulette.getPastEvents('evtReport', {
        filter: { HouseAddress: gsUserETHAccount },
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, events) => {
        objEvents = events
    })
    sTableData = ""
    for (nIndex = 0; nIndex < objEvents.length; nIndex++) {
        nData_CreditOrDebit = DoSafeDecimals(web3.utils.fromWei(objEvents[nIndex].returnValues.CreditOrDebit) * gcnEthToTokenMultiplier)
        sData_PlayerAddress = objEvents[nIndex].returnValues.PlayerAddress
        sData_TimeStamp = new Date(objEvents[nIndex].returnValues.TimeStamp * 1000).toLocaleString("en-US")

        if (sData_PlayerAddress == "0x0000000000000000000000000000000000000000") {
            if (nData_CreditOrDebit > 0) {
                sData_PlayerAddress = "Deposit"
            } else {
                sData_PlayerAddress = "<font color=maroon>Withdrawal</font>"
                nData_CreditOrDebit = "<font color=maroon>" + nData_CreditOrDebit + "</font>"
            }
        } else {
            sData_PlayerAddress = "<a class=bluelink target=_ex href='https://" + gsNetwork_prefix + "etherscan.io/address/" + sData_PlayerAddress + "'>" + sData_PlayerAddress.substr(0, 25) + "..</a>"
            if (nData_CreditOrDebit > 0) {
                nData_CreditOrDebit = "<font color=green>" + nData_CreditOrDebit + "</font>"
            } else {
                nData_CreditOrDebit = "<font color=red>" + nData_CreditOrDebit + "</font>"
            }
        }

        sTableData += "<tr><td width=240>" + sData_TimeStamp + "</td><td width=280>" + sData_PlayerAddress + "</td><td width=120 align=right>" + nData_CreditOrDebit + "</td></tr>"
    }

    sHTML = "<table class='clsScrollingTable' border=1 cellspacing=0 cellpadding=5 align=center width=730><thead>" +
        "<tr><th width=240>Date/Time <font style='font-size:12px;font-weight:normal'>(Your local time zone)</font></th><th width=280>Player Address, or Deposit/Withdrawal</th><th width=120>Credit or Debit</th></tr></thead><tbody style='height:600px'>"
    sHTML += sTableData + '</tbody></table><br>'

    da.idDivHouseReport_TableData.innerHTML = sHTML
    da.idSpanHouseReport_Balance.innerHTML = gnHouseBalance
    da.divOverlay_HouseReport.style.display = 'block';
}


async function DoShowSpinReport() {
    var nIndex, nBetPayout, sBetPayout, nDisplay_YouWon, nDisplay_TotalBet, nDisplay_TotalPayout, sDisplay_YouWon
    var sWinningNumber = ""
    var sHTML = ""
    var sTableData = ""

    if (gnSpin_WinningNumber == 37) {
        sWinningNumber = "<font color=green>0</font>"
    }
    if (gnSpin_WinningNumber == 38) {
        sWinningNumber = "<font color=green>00</font>"
    }
    if (sWinningNumber == '') {
        if (gcnRedNumbers.indexOf(gnSpin_WinningNumber) == -1) {
            sWinningNumber = gnSpin_WinningNumber
        } else {
            sWinningNumber = "<font color=red>" + gnSpin_WinningNumber + "</font>"
        }
    }
    da.idSpanSpinReport_WinningNumber.innerHTML = sWinningNumber

    nDisplay_TotalPayout = 0
    for (nIndex = 0; nIndex < gnaSpacesClicked.length; nIndex++) {
        nBetPayout = DoGetPayout(gnSpin_WinningNumber, gnaSpacesClicked[nIndex])
        nBetPayout = DoSafeDecimals(nBetPayout * da.idCmbChipValue.value)
        if (nBetPayout > 0) {
            sBetPayout = "<font color=green><b>" + nBetPayout + "</b></font>"
            nDisplay_TotalPayout += nBetPayout
        } else {
            sBetPayout = 0
        }
        sTableData += "<tr><td width=100>" + gsaBetDescriptions[gnaSpacesClicked[nIndex]] + "</td><td width=70 align=right>" + sBetPayout + "</td></tr>"
    }

    sHTML = "<table class='clsScrollingTable' border=1 cellspacing=0 cellpadding=5 align=center width=220><thead>" +
        "<tr><th width=100>Your Bets</th><th width=70>Payout</th></tr></thead><tbody style='height:600px'>"
    sHTML += sTableData + '</tbody></table><br>'
    da.idDivSpinReport_TableData.innerHTML = sHTML

    nDisplay_TotalBet = DoSafeDecimals(gnaSpacesClicked.length * da.idCmbChipValue.value)
    nDisplay_TotalPayout = DoSafeDecimals(nDisplay_TotalPayout)
    nDisplay_YouWon = DoSafeDecimals(nDisplay_TotalPayout - nDisplay_TotalBet)

    if (nDisplay_YouWon < 0) {
        sDisplay_YouWon = "<font color=red>Lost " + (-nDisplay_YouWon) + "</font>"
    } else {
        sDisplay_YouWon = "<font color=green>Won " + nDisplay_YouWon + "</font>"
    }
    da.idSpanSpinReport_YouWon.innerHTML = sDisplay_YouWon
    da.idSpanSpinReport_TotalBet.innerHTML = nDisplay_TotalBet
    da.idSpanSpinReport_TotalPayout.innerHTML = nDisplay_TotalPayout

    da.divOverlay_SpinReport.style.display = 'block';
}

function DoDisplayWorkingSplash() {
    da.idSpanWorking_Message.innerHTML = "<center><br><br><br><font color=green style='font-size:15px'><b>" +
        "Loading data from blockchain, please wait ..</b></font><br><br><br><br></center>"
    da.divOverlay_Working.style.display = 'block';
}

async function DoRefreshMetamask() {
    DoDisplayWorkingSplash()
    gnMetaMaskOK = 0
    gnUserETHBalance = 0
    try {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            gsUserETHAccount = accounts[0]
            gsCurrentNetwork = await web3.eth.net.getNetworkType()
            var nNetworkID = await web3.eth.net.getId()
            if (gsCurrentNetwork == gsGoodMetamaskNetwork && nNetworkID == gnGoodNetworkID) {
                gobjContract_Roulette = new web3.eth.Contract(gobjAbi_Roulette, gcsContractAddress_Roulette)

                gnUserETHBalance = DoSafeDecimals(web3.utils.fromWei(await web3.eth.getBalance(gsUserETHAccount)) * gcnEthToTokenMultiplier)
                gsFormattedUserETHBalance = parseFloat(gnUserETHBalance.toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 })

                if (gnUserETHBalance > 0) {
                    gnMetaMaskOK = 1

                    gnGasPrice = web3.utils.toWei(String(1), 'gwei')

                    da.idSpanMetaMaskStatus.innerHTML = "Your <b>" + gsNetwork_Name + "</b> Account (" +
                        "<a target=_ex href='https://" + gsNetwork_prefix + "etherscan.io/address/" + gsUserETHAccount +
                        "' class=bluelink>" + gsUserETHAccount.substring(0, 5) + "..</a></b>" +
                        ") has <font color=maroon><b>" +
                        gsFormattedUserETHBalance + "</b></font> in <b>Kovan</b> tokens."

                }
            }
        }

    } catch (error) {
        console.log('Metamask ERROR:' + error)
    }

    if (gnMetaMaskOK == 0) {
        da.idSpanMetaMaskStatus.innerHTML = "<i>Use <b>MetaMask</b> to select a <b>" + gsNetwork_Name + "</b> account, " +
                "then</i> <a class=bluelink href=\"javascript: DoHardMetamaskRefresh()\"><b>Refresh Metamask</b></a>."
    }
    da.divOverlay_Working.style.display = 'none'
}

function DoBetClick(nIndex) {
    var nFoundIndex = gnaSpacesClicked.indexOf(nIndex);
    if (nFoundIndex != -1) {
        gnaSpacesClicked.splice(nFoundIndex,1)
        var objElement = document.getElementById("idImgChip_" + nIndex);
        objElement.parentNode.removeChild(objElement);
    } else {
        var imgClonedChip = da.idImgChip.cloneNode(true);
        da.idDivAllDivs.appendChild(imgClonedChip);
        imgClonedChip.id = "idImgChip_" + nIndex
        imgClonedChip.style.display = 'inline'
        imgClonedChip.style.left = (da.idTblMain.offsetLeft - 277) + gnaBetClick[nIndex][0]
        imgClonedChip.style.top = gnaBetClick[nIndex][1]
        imgClonedChip.style.cursor = 'pointer'

        imgClonedChip.addEventListener("click", function () { DoBetClick(nIndex) });
        gnaSpacesClicked.push(nIndex)
    }
    var nMaxProfit = DoCalculateMaxProfit()
    if (nMaxProfit > gnPublicMaxPayoutPerSpin) {
        alert("Your last bet caused the Maximum Payout (for Bets Placed) to exceed the House's \"Maximum Payout Per Spin\".")
        DoBetClick(nIndex)
    }

    //DoCalculatePayout()
}

function DoRouletteClick(event) {
    var element = da.idImgRouletteTable
    // Show coordinates of mouse-click
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = element.getBoundingClientRect(),
        nImgRouletteTable_X = elemRect.left - bodyRect.left,
        nImgRouletteTable_Y = elemRect.top - bodyRect.top;
}
function DoSafeDecimals(nNumber) {
    return Math.round(nNumber * 100000) / 100000
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function DoSpinWheel() {
/*
// DEVTEST
//    gnaSpacesClicked = [6]
//    for (var nIndex = 1; nIndex < 51; nIndex++) {
//        gnaSpacesClicked.push(nIndex)
//    }

    gnSpin_WinningNumber = 23
    DoShowSpinReport()
    return
*/

    try {
        if (gnaSpacesClicked.length == 0) {
            alert("You have no bets.")
            return
        }
        await DoRefreshMetamask()
        
        nValue = web3.utils.toWei(String(DoSafeDecimals(gnaSpacesClicked.length * gnBaseChipValue * da.idCmbChipValue.value)))
        DoSubdivideArrays()

        var objData = gobjContract_Roulette.methods.zSpinWheel(
            web3.utils.toWei(String(DoSafeDecimals(gnBaseChipValue * da.idCmbChipValue.value))),
            da.idCmbHouse.value,
            gbaAllSpaces
        ).encodeABI()
        da.idSpanWorking_Image.innerHTML = "<center><img src=roulette_spinning.gif width=60%></center>"
        da.divOverlay_Working.style.paddingTop = 30

        // DEVTEST
        //da.divOverlay_Working.style.display = 'block';
        //return

        await DoSendSignedTransaction(objData, nValue, gcsContractAddress_Roulette);
        if (!gbSendtransactionError) {
            var objResult = await gobjContract_Roulette.methods.zGetWinningNumber().call()
            gnSpin_WinningNumber = parseInt(objResult.nWinningNumber)
            da.idSpanWorking_Image.innerHTML = ""
            da.divOverlay_Working.style.paddingTop = 240
            DoShowSpinReport()
        }
    } catch (error) {
        alert("Error: " + error);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function DoSendSignedTransaction(objData, nValue, sDestContract) {
    setTimeout(function () { DoDisplayWorkingSplash() }, 300)

    try {
        gbSendtransactionError = false
        var nGasEstimate = await web3.eth.estimateGas({
            from: gsUserETHAccount,
            to: sDestContract,
            gasPrice: web3.utils.toHex(gnGasPrice),
            data: objData,
            value: nValue
        })
        nGasEstimate = (nGasEstimate * 1.1).toFixed()
        nGasEstimate = 1000000

        await web3.eth.sendTransaction({
            from: gsUserETHAccount,
            to: sDestContract,
            data: objData,
            gasLimit: web3.utils.toHex(nGasEstimate),
            gasPrice: web3.utils.toHex(gnGasPrice),
            value: nValue
        })
            .on('transactionHash', function (hash) {
                gsLastTxHash = hash
                gnTimerCountdown = 30
                DoDisplayWorkingTimer()
                da.divOverlay_Working.style.display = 'block';
                gobjTimerCountdown = setInterval(DoTimerCountdown, 1000)
            })
        da.divOverlay_Working.style.display = 'none';
        clearTimeout(gobjTimerCountdown);
    }
    catch (error) {
        da.divOverlay_Working.style.display = 'none';
        alert("Your transaction was not processed.")
        gbSendtransactionError = true
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DoTimerCountdown() {
    gnTimerCountdown--;
    if (gnTimerCountdown <= 0) {
        clearTimeout(gobjTimerCountdown);
        da.divOverlay_Working.style.display = 'none';
    }
    DoDisplayWorkingTimer()
}

function DoDisplayWorkingTimer() {
    da.idSpanWorking_Message.innerHTML = "<center><br><br><font style='font-size:15px'><b><font color=green>Your transaction is being stored on the blockchain.</font> " +
        "To see a record of this transaction, click here: <a target=_ex href='https://" +
        gsNetwork_prefix + "etherscan.io/tx/" + gsLastTxHash + "' class=bluelink>" + gsLastTxHash.substr(0, 10) + "..</a>" +
        "<br><br>When completed, this page will refresh. It will take less than <font color=green>" + gnTimerCountdown + "</font> more seconds.</b></font><br><br><br></center>"
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
