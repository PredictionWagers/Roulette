# Prediction Wagers

The <b>Prediction Wagers</b> app was created to allow my friends the chance to win $50, while learning more about cryptocurrencies and the blockchain.

Each friend will receive $50 in <b>WAGER</b> Tokens. To win $50, your balance much reach at least $100. You will then be paid (via PayPal) your balance, minus the $50 that you started with. Here are the rules:
* Each individual bet may not exceed $10.
* You may not send or receive your Tokens to a different address.

To use this app, perform the following instructions:
* Install the Metamask extension into the Chrome browser.
* Text me your public Ethereum address.
* Select the Kovan Test Network from the dropdown. You will have 1 Kovan coin that was sent to you, which is used for "gas".
* At the bottom, click <b>[Add Token]</b>, and click the <b>Custom Token</b> tab.
* Copy-and-paste the following address into the <b>Token Contract Address</b> field: <b>0xbd44C4C9FaE76bB412D6181EEf14006447CFf14F</b>
* <b>WAGER</b> should appear under <b>Token Symbol</b>. Click <b>[Next]</b>, and then click <b>[Add Tokens]</b>.

You will see that you now have 50 <b>WAGER</b> tokens to use with this app. Open the following link in a new tab, to see someone that owns $99 billion in <b>WAGER</b> tokens: [<b>View all WAGER Token Holders</b>](https://kovan.etherscan.io/token/0xbd44c4c9fae76bb412d6181eef14006447cff14f#balances) 

You are now ready to use the app, so open this link in a new tab (and bookmark this URL):
[<b>The Prediction Wagers User Interface</b>](https://predictionwagers.github.io/v1.0/PredictionWagers.htm) 

Metamask will prompt you to <b>Connect</b> to the Github webpage. After clicking <b>Connect</b> on the Metamask popup, you must then click the <b>Unlock</b> button at the top of the app, to unlock your <B>WAGER</B> Tokens. You only have to do these processes once.

Under <b>Open Wager Proposals</b>, enter <b>Your Wager</b> for the bet that you would like to make. For this contest, each individual bet may not exceed $10.

When you click <b>[Submit]</b>, a Metamask popup will ask you to <b>Confirm</b>. About 15 seconds later, your bet will be shown under <b>Your Unresolved Wagers</b>.

After the event has been completed and the outcome has been posted, your bet (under <b>Your Unresolved Wagers</b>) will indicate whether you have won or lost. Either the winner or loser may click the <b>[Resolve Wager]</b> button, which will cause the winner's proceeds to be sent to their Kovan address.

After a wager has <b>Resolved</b>, it will appear under <b>Your Resolved Wagers</b>.
  
Feel free to experiment creating your own <b>Wager Proposals</b>, using the instructions shown below. You may <b>Cancel</b> a <b>Wager Proposal</b> that you create before anyone accepts it.
***
Unlike other websites, this app does not interact with any server (other than reading the files from Github). All the data is stored and read from the blockchain, which is a network of thousands of anonymous computers.

The Proposer can post a wager by selecting the following parameters, pertaining to a particular Question:
* <b>Your Prediction:</b> Yes or No.
* <b>Your Deposit:</b> The maximum amount that you want to risk.
* <b>Minimum Wager:</b> You can prevent Acceptors from making tiny wagers that you would have to individually collect (if you win). If you leave this field blank, it will default to <b>.01</b>.
* <b>Profit Percentage Offered:</b> The "odds" you are offering, expressed in "American Odds" and Percentages.

***For example, here is a wager that someone could post:*** 
> I will bet a maximum of $10 (minimum $2), that the Lakers will beat the Celtics tomorrow. I am offering a 125% profit (+125), so if you bet $2 and you win, you will receive $4.50, for a profit of $2.50.

To use the app, you must use the Chrome or Firefox browser, and be logged into MetaMask with a <b>Kovan</b> address selected that contains <b>WAGER</b> tokens.
1. The first time a Kovan address is used, click <b>Connect</b> on the Metamask popup, and (at the top of the app) click the <b>[Unlock WAGER Tokens]</b> button, so the app can access tokens from the address that is selected in MetaMask.
2. The Proposer shall deposit tokens to cover their side of the wager. For example, if the Proposer offers a 125% profit on a $10 wager, then they must deposit $12.50.
3. The Proposer may withdraw their deposit at any time before it is accepted.
4. If a Proposer wants to bet against their own Wager Proposal, the Proposer must use a different Kovan address.
5. The Acceptor must unlock and deposit <b>WAGER</b> tokens, to accept at least the Minimum Proposed Wager.
6. The app creator will post the result for each Question after the event has been completed.
7. The result ("YOU WON, or "YOU LOST") will then be shown under "Unresolved Wagers".
8. The winner or loser may Resolve the wager at any time after the app creator has posted the result of the Question.
9. When a Wager is Resolved, the app shall transfer the correct amount to each party, and the Proposer shall receive the balance of their deposit. 
For example, if the Proposer deposited $1.25 to offer a 125% profit on a $1 wager, and the Acceptor wagered $.50 and won, then the Acceptor would receive $1.15 ($.50 + $.625), and the Proposer would receive $.625 (the balance of their $1.25 deposit).
10. The smallest allowable wager is $.01, and all wagers and calculations are rounded down to two digits to the right of the decimal point. 
For example, if you enter a wager for $.03 that pays 50% profit, then you will receive $.01 profit (instead of $.015).
11. The app creator shall receive a 1.5% transaction fee from each deposit. For example, a net deposit of $1.00 shall require a gross deposit of $1.015.

The <b>Prediction Wagers</b> app was created by an anonymous author, and is publicly accessible. It can be run from any server, so this Github user is not responsible or liable for its usage. Please see the [Terms of Use](https://predictionwagers.github.io/v1.0/TermsOfUse.htm) for more information.
