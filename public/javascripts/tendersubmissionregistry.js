$(document).ready(function() {
    const documentRegistryContractAddress = '0x949c76215c7333c1697297fcd6307703aa77115d';
    const documentRegistryContractABI = [{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"add","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"string"}],"name":"verify","outputs":[{"name":"dateAdded","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];


    var CONSTANTS = {
                  HOME_TENDER_DOCS_MENU_BUTTON : "#homeTenderDocsMenuButton",
                  UPLOAD_TENDER_DOCS_MENU_BUTTON : "#uploadTenderDocsMenuButton",
                  VERIFY_TENDER_DOCS_MENU_BUTTON : "#verifyTenderDocsMenuButton",
                  LOADING : "#loadingRow",
                  NOTIFICATION_BAR_ROW: "#notificationBarRow",
                  HOW_IT_WORKS: "#howItWorksTenderDocsRow",
                  UPLOAD_TENDER_DOCS: "#uploadTenderDocsRow",
                  VERIFY_TENDER_DOCS: "#verifyTenderDocsRow",
                  UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP: "#uploadTenderDocsInputFileZIP",
                  UPLOAD_TENDER_DOCS_LABEL_FILE_ZIP: "#uploadTenderDocsLabelFileZIP",
                  VERIFY_TENDER_DOCS_INPUT_FILE_ZIP: "#verifyTenderDocsInputFileZIP",
                  VERIFY_TENDER_DOCS_LABEL_FILE_ZIP: "#verifyTenderDocsLabelFileZIP",
                  UPLOAD_TENDER_DOCS_BUTTON_SUBMIT: "#uploadTenderDocsButtonSubmit",
                  VERIFY_TENDER_DOCS_BUTTON_SUBMIT: "#verifyTenderDocsButtonSubmit",
                  NOTIFICATION_BAR_DIV: "#divNotificationBar",
                  SUCCESS: "success",
                  ERROR: "error",
                  WARNING: "warning"
                };

    $(CONSTANTS.HOME_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(CONSTANTS.HOW_IT_WORKS) });
    $(CONSTANTS.UPLOAD_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(CONSTANTS.UPLOAD_TENDER_DOCS) });
    $(CONSTANTS.VERIFY_TENDER_DOCS_MENU_BUTTON).click(function() { displayRow(CONSTANTS.VERIFY_TENDER_DOCS) });
    $(CONSTANTS.UPLOAD_TENDER_DOCS_BUTTON_SUBMIT).click(uploadTenderZIP);
    $(CONSTANTS.VERIFY_TENDER_DOCS_BUTTON_SUBMIT).click(verifyTenderZIP);

    displayRow(CONSTANTS.HOW_IT_WORKS);

    // Show/Hide a "loading" indicator when AJAX request starts/completes:
    $(document).on({
        ajaxStart: function() { $(CONSTANTS.LOADING).show() }, //ajaxStart specifies a function to run when the first AJAX request begins
        ajaxStop: function() { $(CONSTANTS.LOADING).hide() } //ajaxStop specifies a function to run when all AJAX requests have completed
    });
    
    $(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP).on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next(CONSTANTS.VERIFY_TENDER_DOCS_LABEL_FILE_ZIP).html(fileName);
    });

    $(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP).on('change',function(){
        //get the file name
        var fileName = $(this).val();
        //replace the "Choose a file" label
        $(this).next(CONSTANTS.UPLOAD_TENDER_DOCS_LABEL_FILE_ZIP).html(fileName);
    });

    function triggerNotificationOpen(parentDivID, alertDivID, alertMessage, alertType) {
      console.log("triggerNotificationOpen");
      $(CONSTANTS.NOTIFICATION_BAR_ROW).show();
      if (alertType === CONSTANTS.SUCCESS)
        var divNotificationHtml = '<div id='+alertDivID+' class="alert alert-success fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>'+alertMessage+'</strong></div>';
      else if (alertType === CONSTANTS.ERROR)
         var divNotificationHtml = '<div id='+alertDivID+' class="alert alert-danger fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>'+alertMessage+'</strong></div>';
      else if (alertType === CONSTANTS.WARNING)
          var divNotificationHtml = '<div id='+alertDivID+' class="alert alert-warning fade in show"><button type="button" class="close close-alert" data-dismiss="alert" aria-hidden="true">×</button><strong>'+alertMessage+'</strong></div>';
      console.log(divNotificationHtml)
      $(parentDivID).html(divNotificationHtml);
    };
    
    function displayRow(rowName) {
        // Hide rows
        $(CONSTANTS.LOADING).hide();
        $(CONSTANTS.HOW_IT_WORKS).hide();
        $(CONSTANTS.UPLOAD_TENDER_DOCS).hide();
        $(CONSTANTS.VERIFY_TENDER_DOCS).hide();
        $(CONSTANTS.NOTIFICATION_BAR_ROW).hide();

        // Display the passed in row
        $(rowName).show();
    }

    async function uploadTenderZIP() {
        if ($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files.length == 0){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please select a Tender Documents ZIP file to upload.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }
		if (window.ethereum)
			try {
				await window.ethereum.enable();
			} catch (err) {
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Access to your Ethereum account rejected.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
			}
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let documentHash = sha256(fileReader.result);
            if (typeof web3 === 'undefined'){
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
            }

            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.add(documentHash, function(err, result) {
                if (err){
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                    return console.log("Smart contract call failed: " + err);
                }

                var message_type = CONSTANTS.SUCCESS; //error or success
                var message_description = `Tender Documents ZIP file with hash ${documentHash} <b>successfully added</b> to the Tender Submission Registry (Blockchain).`;

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divUploadTenderZIPAlert"', message_description, message_type);
                console.log(message_description);
            });
        };
        fileReader.readAsBinaryString($(CONSTANTS.UPLOAD_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0]);
    }

    function verifyTenderZIP() {
        if ($(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files.length == 0){
            var message_type = CONSTANTS.ERROR; //error or success
            var message_description = "Please select a Tender Documents ZIP file to verify.";

            triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
            return console.log(message_description);
        }
        let fileReader = new FileReader();
        fileReader.onload = function() {
            let documentHash = sha256(fileReader.result);
            if (typeof web3 === 'undefined'){
                var message_type = CONSTANTS.ERROR; //error or success
                var message_description = "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

                triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                return console.log(message_description);
            }
            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
            contract.verify(documentHash, function(err, result) {
                if (err){
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description = "Tender Submission Registry smart contract call failed: " + err;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
                }

                let contractPublishDate = result.toNumber(); // Take the output from the execution
                if (contractPublishDate > 0) {
                    let displayDate = new Date(contractPublishDate * 1000).toLocaleString();

                    var message_type = CONSTANTS.SUCCESS; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>valid<b>. Uploaded to Tender Submission Registry (Blockchain) on: ${displayDate}.`;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    console.log(message_description);
                }
                else
                    var message_type = CONSTANTS.ERROR; //error or success
                    var message_description =`Tender Documents ZIP file with hash ${documentHash} is <b>invalid</b>: not found in the Tender Submission Registry (Blockchain).`;

                    triggerNotificationOpen(CONSTANTS.NOTIFICATION_BAR_DIV, '"divVerifyTenderZIPAlert"', message_description, message_type);
                    return console.log(message_description);
            });
        };
        fileReader.readAsBinaryString($(CONSTANTS.VERIFY_TENDER_DOCS_INPUT_FILE_ZIP)[0].files[0]);
    }
});
