/**
Constructor
*/
class TabItemView05 extends AView
{
	constructor()
	{
		super()
		
		//TODO:edit here
	
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)
		
		this.USE_ONLY_CSS_ZOOM = true;
		this.TEXT_LAYER_MODE = 0;
		this.MAX_IMAGE_SIZE = 1024 * 1024;
		this.CMAP_URL = './Assets/cmaps/';
		this.CMAP_PACKED = true;
		
		this.DEFAULT_URL = './Assets/pdffiles/compressed.tracemonkey-pldi-09.pdf';
		this.DAFAULT_SCALE = 1;
		this.MIN_SCALE = 0.25;
		this.MAX_SCALE = 10;
		this.DEFAULT_SCALE_VALUE = "auto";
		
		var pdfView = new pdfjsViewer.PDFViewer;
		console.log(pdfView);
	}
	
	onInitDone()
	{
		super.onInitDone();
		
		const thisObj = this;
		
		this.PDFViewerApplication = {
			pdfLoadingTask: null,
			pdfDocument: null,
			pdfViewer: null,
			pdfHistory: null,
			pdfLinkService: null,
			eventBus: null,
			
			open(params) {
				if(this.pdfLoadingTask) {
					//destory opened Document
					return this.close().then(
						function() {
							//repeat the open() call
							return this.open(params);
						}.bind(this)
					);
				}
				const url = params.url
				const self = this;
				this.setTitleUsingUrl(url);
				
				//Loading Document
				const loadingTask = pdfJsLib.getDocument({
					url,
					maxImageSize: self.MAX_IMAGE_SIZE,
					cMapUrl: self.CMAP_URL,
					cMapPacked: self.CMAP_PACKED,
				});
				this.pdfLoadingTask = loadingTask;
				
				loadingTask.onProgress = function(progressData) {
					self.progress(progressData.loaded / progressData.total);
				};
				
				return loadingTask.promise.then(
					function(pdfDocument) {
						self.pdfDocument = pdfDocument;
						self.pdfViewer.setDocument(pdfDocument);
						self.pdfLinkService.setDocument(pdfDocument);
						self.pdfHistory.initialize({
							fingerprint: pdfDocument.fingerprints[0]
						});
						
// 						self.loadingBar.hide()
						self.setTitleUsingMetadata(pdfDocument);
					},
					function(exception) {
						const message = exception && exception.message;
						const l10n = self.l10n;
						let loadingErrorMessage;
						
						if (exception instanceof pdfjsLib.InvalidPDFException) {
						  // change error message also for other builds
						  loadingErrorMessage = l10n.get(
							"invalid_file_error",
							null,
							"Invalid or corrupted PDF file."
						  );
						} else if (exception instanceof pdfjsLib.MissingPDFException) {
						  // special message for missing PDFs
						  loadingErrorMessage = l10n.get(
							"missing_file_error",
							null,
							"Missing PDF file."
						  );
						} else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
						  loadingErrorMessage = l10n.get(
							"unexpected_response_error",
							null,
							"Unexpected server response."
						  );
						} else {
						  loadingErrorMessage = l10n.get(
							"loading_error",
							null,
							"An error occurred while loading the PDF."
						  );
						}

						loadingErrorMessage.then(function (msg) {
						  self.error(msg, { message });
						});
						self.loadingBar.hide(); 
					}
				);
			},
			//close opend PDF Document
			close() {
				thisObj.errorWrapper.hide();
				
				if(!this.pdfLoadingTask) {
					return Promise.resolve();
				}
				
				const promise = thie.pdfLoadingTask.destroy();
				this.pdfLoadingTask = null;
				
				if(this.pdfDocument) {
					this.pdfDocument = null;
					
					this.pdfViewer.setDocument(null);
					this.pdfLinkService.setDocument(null, null);
					
					if(this.pdfHistory) {
						this.pdfHistory.reset();
					}
				}
				return promise;
			},
			setTitleUsingUrl: function pdfViewerSetTitleUsingUrl(url) {
				this.url = url;
				let title = pdfjsLib.getFilenameFromUrl(url) || url;
				try {
					title = decodeURIComponent(title);
				} catch (e) {
					//catch error
				}
				this.setTitle(title);
			},
			setTitleUsingMetadata(pdfDocument) {
				const self = this;
				pdfDocument.getMetaData().then(function(data) {
					const info = data.info,
						  meatdata = data.metadata;
					self.documentInfo = info;
					self.metadata = metadata;
					
					//provide debug info
					console.log(
						"PDF " +
							pdfDocument.fingerprints[0] +
							" [" +
							info.PDFFormatVersion +
							" " +
							(info.Producer || "-").trim() +
							" / " +
							(info.Creator || "-").trim() +
							"]" +
							" (PDF.js: " +
							(pdfjsLib.version || "-") +
							")"
					);
					
					let pdfTitle;
					if(metadata && metadata.has("dc:title")) {
						const title = metadta.get("dc:title");
						
						if(title !== "Undefined") {
							pdfTitle = title
						}
					}
					
					if(!pdfTitle && info && info.Title) {
						pdfTitle = info.Title;
					}
				});
			},
			
			setTitle: function pdfViewSetTitle(title) {
				document.title = title;
				thisObj.title.setText(title);
			},
			
			error: function pdfViewError(message, moreInfo) {
				const l10n = this.l10n;
				const moreInfoText = [
					l10n.get(
						"error_version_info",
						{version: pdfjsLib.version || "?", build: pdfjsLib.build || "?"},
						"PDF.js v{{version}} (build: {{build}})"
					),
				];
				
				if(moreInfo) {
					moreInfoText.push(
						l10n.get(
							"error_message",
							{message: moreInfo.message},
							"Message L {{message}}"
						)
					);
					if(moreInfo.stack) {
						moreInfoText.push(
							l10n.get("error_stack", {stack: moreInfo.stack}, "Stack : {{stack}}")
						);
					} else {
						if(moreInfo.filename) {
							moreInfoText.push(
								l10n.get(
									"error_file",
									{file: moreInfo.filename},
									"File: {{file}}"
								)
							);
						}
						if(moreInfo.lineNumber) {
							moreInfoText.push(
								l10n.get(
									"error_line",
									{line: moreInfo.lineNumber},
									"File: {{file}}"
								)
							);
						}
					}
				}
				/*
				const errorWrapper = thisObj.errorWrapper;
				errorWrapper.show();

				const errorMessage = thisObj.errorMessage;
				errorMessage.setText(message);

				const closeButton = thisObj.errorClose.$ele;
				closeButton.onClick = function() {
					errorWrapper.hide();
				};
				*/
			},
			
			get pagesCount() {
				return this.pdfDocument.numPages;
			},
			
			get Page() {
				return this.pdfViewer.currentPageNumber;
			},
			
			set page(val) {
				this.pdfViewer.currentPageNumber = val;
			},
			
			zoomIn: function pdfViewZoomIn(ticks) {
				let newScale = this.pdfViewer.currentScale;
				do{
					newScale = (newScale * thisObj.DAFAULT_SCALE).toFixed(2);
					newScale = Math.ceil(newScale * 10) / 10;
					newScale = Math.min(thisObj.MAX_SCALE, newScale);
				} while (--ticks && newScale < thisObj.MAX_SCALE);
				this.pdfViewer.currentScaleValue = newScale;
			},
			
			zoomOut: function pdfViewZoomOut(ticks) {
				let newScale = this.pdfViewer.currentScale;
				do{
					newScale = (newScale / thisObj.DAFAULT_SCALE).toFixed(2);
					newScale = Math.floor(newScale * 10) / 10;
					newScale = Math.max(thisObj.MIN_SCALE, newScale)
				} while(--ticks && newScale > thisObj.MIN_SCALE);
				this.pdfViewer.currentScaleValue = newScale;
			},
			
			initUI: function pdfViewInitUI() {
				const eventBus = new pdfjsViewer.EventBus();
				this.eventBus = eventBus;
				
				const linkService = new pdfjsViewer.PDFLinkService({
					eventBus,
				});
				
				this.pdfLinkService = linkService;
				
				this.l10n = pdfjsViewer.NullL10n;
				
				const container = thisObj.content.$ele;
				const pdfViewer = new pdfjsViewer.PDFViewer({
					container,
					eventBus,
					linkService,
					l10n: this.l10n,
					useOnlyCssZoom: thisObj.USE_ONLY_CSS_ZOOM,
					textLayerMode: thisObj.TEXT_LAYER_MODE,
				});
				this.pdfViewer = pdfViewer;
				linkService.setViewer(pdfViewer);
				
				this.pdfHistory = new pdfjsViewer.PDFHistory({
					eventBus,
					linkService,
				});
				linkService.setHistory(this.pdfHistory);
				
				eventBus.on("pagesinit", function() {
					pdfViewer.currentScaleValue = thisObj.DEFAULT_SCALE_VALUE;
				});
				
				eventBus.on("pagechangin", function(evt) {
						const page = evt.pageNumber;
						const numPages = PDFViewerApplication.pagesCount;

						thisObj.pageNumber.setText(page);
						thisObj.previous.$ele.disabled = page <= 1;
						thisObj.next.$ele.disabled = page >= numPages;
					},
					true
				);
			}
		};	// this.PDFViewerApplication end
		
	}
	
	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);
		
		this.PDFViewerApplication.initUI();
		
		this.PDFViewerApplication.open({
			url: this.DEFAULT_URL,
		});
		
	}
	
	onPreviousClick(comp, info, e)
	{
		this.PDFViewerApplication.page--;
		
	}

	onNextClick(comp, info, e)
	{
		this.PDFViewerApplication.page++;		

	}

	onZoomInClick(comp, info, e)
	{
		this.PDFViewerApplication.zoomIn();

	}

	onZoomOutClick(comp, info, e)
	{
		this.PDFViewerApplication.zoomOut();

	}

	onPageNumberClick(comp, info, e)
	{
		this.PDFViewerApplication.zoomOut()	;

	}

	onPageNumberChange(comp, info, e)
	{
		this.PDFViewerApplication.page = this.pageNumber.getText();

	}
}

window["TabItemView05"] = TabItemView05
