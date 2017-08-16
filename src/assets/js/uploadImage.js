  function previewFile(){
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           console.log(reader.result);
           preview.src = reader.result;
       }

       if (file) {
          console.log( reader.readAsDataURL(file));
		  console.log(reader);//reads the data as a URL
       } else {
           preview.src = "";
       }
  }
  previewFile();  //calls the function named previewFile()