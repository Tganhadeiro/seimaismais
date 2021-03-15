/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/

/******************************************************************************
 * Executa ao instalar ou atualizar o complemento.                           *
 ******************************************************************************/
function handleInstalled(details) {
  console.log(details.reason);

  function onError(error) { console.log(`Error: ${error}`); }
  function AbrirUrlSeipp(item) {
    // Ao instalar ou atualizar.
    item.InstallOrUpdate = true;
    browser.storage.local.set(item);
  }

  if (isChrome) { /* Chrome: */
    browser.storage.local.get("CheckTypes", AbrirUrlSeipp);
  } else {
    var gettingItem = browser.storage.local.get("CheckTypes");
    gettingItem.then(AbrirUrlSeipp, onError);
  }
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
const isChrome = (typeof browser === "undefined"); /* Chrome: */
if (isChrome) { var browser = chrome; } /* Chrome: */

browser.runtime.onInstalled.addListener(handleInstalled);

if(!isChrome) {
  browser.runtime.getBrowserInfo().then(function (info) {
    browser.storage.local.set({version: info.version}).then(null, null);
  });
}