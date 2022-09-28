class PdfViewer{
  
  constructor()
  {
    this.targetView = null;
    
    this.pdfViewer = null;
    this.pdfPage = null;
    this.pdfCanvas = null;
    this.pdfUrl = null;
    
    this.countOfPdfPages = null;
  
    this.pageRendering = false;
    
    this.scale = 1;
  
    this.pdfApplication = {};
    
    this.init();
  }
  
  init()
  {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js'
    
    this.pdfUrl = 'compressed.tracemonkey-pldi-09.pdf';
    this.pdfViewer = this.createPdfViewer();
    
    const thisObj = this;
    
    this.pdfApplication = this.setPdfApplication();
    
    const loadingTask = pdfjsLib.getDocument(this.pdfApplication.fileUrl);
    
    loadingTask.promise.then(pdfDoc => {
  
      thisObj.pdfApplication.file = pdfDoc;
      thisObj.countOfPdfPages = pdfDoc.numPages;
      
      for(let i = 0; i < thisObj.countOfPdfPages; i++) {
        const pdfCanvas = thisObj.createPdfCanvas(i + 1);
        const pdfPage = thisObj.createPdfPages(i + 1);
  
        pdfPage.appendChild(pdfCanvas);
        thisObj.pdfViewer.appendChild(pdfPage);
        
        // 처음 pdf 로딩할 때는 3페이지만 로드
        thisObj.readyPage(i + 1);
      }
      thisObj.detectScroll();
    })
    
  
  }
  
  setPdfApplication()
  {
    return {
      file: null,
      fileUrl: this.pdfUrl,
      countOfPages: 0,
      
      scale: this.scale,
    }
    
  }
  
  createPdfViewer()
  {
    const pdfViewer = document.createElement('div');
  
    pdfViewer.setAttribute('id', 'A_pdfViewer');
    pdfViewer.style.backgroung = 'white';
    pdfViewer.style.left = '0px';
    pdfViewer.style.top = '0px';
    pdfViewer.style.position = 'relative';
    pdfViewer.style.overflow = 'hidden';
    pdfViewer.style.marginLeft = 'auto';
    pdfViewer.style.marginRight = 'auto';
    pdfViewer.style.border = 'none';
    pdfViewer.style.width = '100%';
    pdfViewer.style.height = 'auto';
    
    return pdfViewer;
    
  }
  
  createPdfPages(pageNumber)
  {
    const pdfPage = document.createElement('div');
    
    pdfPage.setAttribute('id', `A_pdfPage_${pageNumber}`);
    pdfPage.setAttribute('class', 'A_pdfPage');
    pdfPage.style.background = 'rgba(0, 0, 0, 0)';
    pdfPage.style.left = '0px';
    pdfPage.style.top = '0px';
    pdfPage.style.position = 'relative';
    pdfPage.style.width = '100%';
    pdfPage.style.heigth = '100%';
    pdfPage.style.border = '1px solid black';
    
    return pdfPage;
    
  }
  
  createPdfCanvas(pageNumber)
  {
    const pdfCanvas = document.createElement('canvas');
    
    pdfCanvas.setAttribute('id', `A_pdfCanvas_${pageNumber}`);
    pdfCanvas.style.background = 'rgba(0, 0, 0, 0)';
    pdfCanvas.style.left = '0px';
    pdfCanvas.style.top = '0px';
    pdfCanvas.style.positon = 'absolute';
    pdfCanvas.style.width = '100%';
    pdfCanvas.style.heigth = '100%';
    
    return pdfCanvas;
    
  }
  
  setActivePdfViewer(targetView)
  {
    this.setTargetView(targetView);
    
  }
  
  setTargetView(targetView)
  {
    this.targetView = targetView;
    this.targetView.appendChild(this.pdfViewer);
  }
  
  //페이지 크기만 설정
  readyPage(pageNum) {
    
    const thisObj = this;
    const canvas = document.querySelector(`#A_pdfCanvas_${pageNum}`);
    
    
    this.pdfApplication.file.getPage(pageNum).then(page => {
      const viewport = page.getViewport({scale: thisObj.pdfApplication.scale});
      
      const outputScale = window.devicePixelRatio || 1;
      
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height =  Math.floor(viewport.height) + "px";
      
      console.log('pages ready');
      
    });
  }
  
  //페이지 랜더링
  renderPage(pageNum)
  {
    
    const thisObj = this;
    const canvas = document.querySelector(`#A_pdfCanvas_${pageNum}`);
    const ctx = canvas.getContext('2d');
    
    if(canvas.isRender) {
      console.log('이미 로드됨..');
      return;
    }
    
    canvas.isRender = true;
  
    this.pageRendering = true;
    
    this.pdfApplication.file.getPage(pageNum).then(page => {
      const viewport = page.getViewport({scale: thisObj.pdfApplication.scale});
  
      const outputScale = window.devicePixelRatio || 1;
  
      //여기부터 랜더링
      let transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
  
      const renderContext = {
        canvasContext: ctx,
        transform: transform,
        viewport: viewport
      };
  
      const renderTask = page.render(renderContext);
      
      renderTask.promise.then(() => {
    
        thisObj.pageRendering = false;
        
        // if(thisObj.pageNumPending !== null) {
        //   thisObj.renderPage(thisObj.pageNumPending);
        //   thisObj.pageNumPending = null;
        // }
        console.log(canvas.id, '=> Page render');
      });
    });
    
  }
  
  
  detectScroll()
  {
    const thisObj = this;
    const pdfPages = document.querySelectorAll('.A_pdfPage');
    // pdfPages.forEach(pdfPage => console.log(pdfPage));
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        let pageNum = Number(entry.target.id.split('_')[2]);
        
        if(entry.isIntersecting) {
          thisObj.renderPage(pageNum);
        } else {
          console.log('..');
        }
        
        
      })
    });
    
    pdfPages.forEach(pdfPage => {
      observer.observe(pdfPage);
    })
    // window.addEventListener('scroll', () => {
    //   console.log(scrollX, scrollY);
    // })
  }
  
  
}
