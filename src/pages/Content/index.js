import React from 'react';
import { render } from 'react-dom';
import CountryCodes from './modules/CountryCodes';
import Widget from '../Newtab/Newtab';

var Server = chrome.runtime;
var Store = chrome.storage.local;

main();

async function main() {
  var searchElems = document.querySelectorAll('.jtfYYd');
  var searchElems2 = document.querySelectorAll('.BYM4Nd');
  var searchInput = document.querySelectorAll('input[aria-label="Search"]');
  var countryElem = document.querySelectorAll('.Q8LRLc');
  var Obj = {};
  var Token = await getDatafromStorage('token');
  if (searchElems.length > 0) {
    Obj.query = searchInput[0]?.value ?? '';
    Obj.location = getCountryCode(countryElem[0]?.innerText ?? '');
    Obj.results = getResults(searchElems, searchElems2);
    console.log(Obj);
    showDataWidget(Obj);
  } else {
    console.log('no search elem');
  }
}

function getResults(searchElems, searchElems2) {
  console.log(searchElems2);
  var searchData = [];
  var indexZ = 0;

  Array.from(searchElems2).forEach((elem, index) => {
    var obj = {};
    obj.title = elem?.querySelector('h3')?.innerText ?? '';
    obj.link = elem?.querySelector('a')?.href ?? '';
    obj.snippet = elem?.querySelector('.VwiC3b')?.innerText ?? '';
    if (obj.title !== '' && obj.link !== '' && obj.snippet !== '') {
      indexZ = indexZ + 1;
      obj.position = indexZ;
      searchData.push(obj);
    }
  });
  Array.from(searchElems).forEach((elem, index) => {
    var obj = {};
    obj.title = elem?.querySelector('h3')?.innerText ?? '';
    obj.link = elem?.querySelector('a')?.href ?? '';
    obj.snippet = elem?.querySelector('.VwiC3b')?.innerText ?? '';
    if (obj.title !== '' && obj.link !== '' && obj.snippet !== '') {
      indexZ = indexZ + 1;
      obj.position = indexZ;
      searchData.push(obj);
    }
  });

  return searchData;
}

function getCountryCode(str) {
  if (str !== '') {
    var found = Object.keys(CountryCodes).find((e) => CountryCodes[e] === str);
    if (found) {
      return found;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getDatafromStorage(str) {
  return new Promise((resolve, reject) => {
    Store.get(str, (res) => {
      if (res[str]) {
        resolve(res[str]);
      } else {
        resolve(null);
      }
    });
  });
}

function showDataWidget(data) {
  var rightSection = document.querySelectorAll('#rhs');
  var wholeSection = document.querySelectorAll('#center_col');
  if (rightSection.length > 0) {
    injectWidget(data, 'prepend', rightSection[0]);
  } else if (wholeSection.length > 0) {
    injectWidget(data, 'append', wholeSection[0]);
  }
}

async function injectWidget(data, type, elem) {
  var domainAge = await getDatafromStorage('domainAge');
  var activateState = await getDatafromStorage('activate');
  var div = document.createElement('div');
  div.id = 'keywordZebraExt';
  if (type == 'prepend') {
    div.style =
      'z-index: 121;width: 369px;flex: 0 auto;position: relative;padding-bottom: 15px;';
    elem.prepend(div);
  } else if (type == 'append') {
    div.style =
      'z-index: 121; height: fit-content;left: 109% !important; height: fit-content; position: absolute;top: 0px;';
    elem.appendChild(div);
  }

  render(
    <Widget data={data} domainAge={domainAge} activateState={activateState} />,
    window.document.querySelector('#keywordZebraExt')
  );
}
