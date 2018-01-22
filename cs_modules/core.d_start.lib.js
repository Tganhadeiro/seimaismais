/*** Configurações do sistema *************************************************/
/** Opção padrão caso não exista opções salvas. */
var DefaultOptions = {
  theme: "white",
  CheckTypes: [],
  InstallOrUpdate: true,
  ConfiguracoesCores: [
    {valor: "", cor: "00cc00"},
    {valor: "", cor: "ffff00"},
    {valor: "", cor: "ffb3cc"},
    {valor: "", cor: "33ccff"},
    {valor: "", cor: "bfbfbf"}
  ]
};

const CompName = "Seipp";

/** Options salvas */
var SavedOptions = DefaultOptions;

/*** Verifica se está utilizando o navegador chrome ***************************/
const isChrome = (typeof browser === "undefined"); /* Chrome: */
if (isChrome) { var browser = chrome; } /* Chrome: */

/*** Url base do sei ***********************************************************/
function GetBaseUrl() {
  return window.location.protocol + "//" + window.location.hostname + "/sei/";
}

/*** MODULES: Generic class log ************************************************/
function __mconsole(ModuleName) {
  this.PModuleName = ModuleName;
  console.log("[" + CompName + " " + Date.now() + "]  " + this.PModuleName + ": Loading...");
}
__mconsole.prototype.log = function(message) {
    console.log("[" + CompName + " " + Date.now() + "]    "+ this.PModuleName+": " + message);
}

function Init(BaseName) {
  console.log("[" + CompName + " " + Date.now() + "]" + BaseName);
}

function ModuleInit(BaseName, PageReload = false) {
  var ModName = CompName + "." + BaseName;
  var IsModExec = $("head meta[name='" + ModName + "'").attr("value");

  if (IsModExec != "true") {
    $("head").append("<meta name='" + ModName + "' value='true'>");
    console.log("[" + CompName + " " + Date.now() + "]" + BaseName);
    return true;
  } else if (IsModExec == "true" && PageReload) {
    window.location.assign(window.location.href);
    console.log("[" + CompName + " " + Date.now() + "]" + BaseName + "Reload page");
    return false;
  } else {
    return false;
  }
}
/*** Biblioteca de strings *****************************************************/

/** Adiciona a mascara de CPF/CNPJ. */
function format_cpf(cpf) {
  var mask = cpf;

  if (cpf.length == 11) {
    mask = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cpf.length == 14) {
    mask = cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5");
  } else mask = "";
  return mask;
}

/** Adicionar link css na página */
function AdicionarLinkCss(doc, id, href) {
  var head = doc.getElementsByTagName('head')[0];
  if (head == undefined) return;
  var link = doc.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = browser.extension.getURL(href);
  link.media = 'all';
  head.appendChild(link);
}

function isNumOnly(str) {
  if (isNaN(parseInt(str))) {
    return false;
  } else {
    return true;
  }
}

/**
 * PARA CHROME: Remove todos velhos eventos.
 * Necessário ao substutuir os eventos padrão.
 * @param {HTMLElement} Elem
 */
function RemoveAllOldEventListener(Elem) {
  $(Elem).replaceWith($(Elem).clone());
}