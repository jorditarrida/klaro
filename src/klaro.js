import 'scss/klaro.scss'
//import 'scss/klaro.css';

import React from 'react'
import App from 'components/app.js'
import ConsentManager from 'consent-manager'
import {render} from 'react-dom'
import translations from 'translations'
import {convertToMap, update} from 'utils/maps'
import {t, language} from 'utils/i18n'
import currentExecutingScript from 'current-executing-script';

const script = document.currentScript || currentExecutingScript();
const originalOnLoad = window.onload
const convertedTranslations = convertToMap(translations)
const configName = script.dataset.config || "MortensenConsentManagerConfig"
const noAutoLoad = script.dataset.noAutoLoad == "true"
const stylePrefix = script.dataset.stylePrefix || "MortensenConsentManager"
const config = window[configName]
const managers = {}

window.onload = initialize

if (module.hot) {
    if (!noAutoLoad)
        renderKlaro(config)
    module.hot.accept()
}

function getElementID(config){
    return config.elementID || 'MortensenConsentManager'
}

function getElement(config){
    const id = getElementID(config)
    var element = document.getElementById(id)
    if (element === null){
        element = document.createElement('div')
        element.id = id
        document.body.appendChild(element)
    }
    return element
}

function getTranslations(config){
    const trans = new Map([])
    update(trans, convertedTranslations)
    update(trans, convertToMap(config.translations || {}))
    return trans
}

export function renderKlaro(config, show){
    if (config === undefined)
        return
    const element = getElement(config)
    const trans = getTranslations(config)
    const manager = getManager(config)
    const lang = config.lang || language()
    const tt = (...args) => {return t(trans, lang, ...args)}
    const app = render(<App t={tt}
                            stylePrefix={stylePrefix}
                            manager={manager}
                            config={config}
                            show={show || false} />, element)
    return app
}

export function initialize(e){
    if (!noAutoLoad)
        renderKlaro(config)
    if (originalOnLoad !== null){
        originalOnLoad(e)
    }
}

export function getManager(conf){
    conf = conf || config
    const name = getElementID(conf)
    if (managers[name] === undefined)
        managers[name] = new ConsentManager(conf)
    return managers[name]
}

export function show(conf){
    conf = conf || config
    renderKlaro(conf, true)
    return false
}

export function version(){
    return VERSION
}

export {language}