const BaseName = "documento_gerar";

if (ModuleInit(BaseName)) {
  if (SavedOptions.usardocumentocomomodelo) {
    GerarDocumentoComModelo(BaseName);
  }  
  AumentaTamanho(BaseName);
}