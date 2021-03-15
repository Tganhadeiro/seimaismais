/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/
const ModName_start = "core.d_start";

function Main(Options) {
  Init(ModName_start);

  /** Carrega as opções configuradas */
  if (Options.theme != undefined) {
    SavedOptions = Options;
  }

  if (SavedOptions.ConfPrazo == undefined) { SavedOptions.ConfPrazo = DefaultOptions.ConfPrazo }
  if (SavedOptions.ConfDias == undefined) { SavedOptions.ConfDias = DefaultOptions.ConfDias }

  if (SavedOptions.theme != "white") {
    Theme(ModName_start, SavedOptions.Theme);
  }

  if (window.location.href == GetBaseUrl()) {
    setTimeout(function () {
      RedirecionarPagina(ModName_start);
    }, 500);
  }
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
function onError(e) { console.error(e); }

if (isChrome) { /* Chrome: */
  browser.storage.local.get(Main);
} else {
  const gettingStoredSettings = browser.storage.local.get();
  gettingStoredSettings.then(Main, onError);
}
