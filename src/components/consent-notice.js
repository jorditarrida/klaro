import React from 'react'
import ConsentModal from './consent-modal'
import {getPurposes} from 'utils/config'

export default class ConsentNotice extends React.Component {

    componentWillReceiveProps(props){
        if (props.show)
            this.setState({modal : undefined})
    }

    render(){

        const {modal} = this.state
        const {config, manager, show, t} = this.props

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")

        const showModal = (e) => {
            if (e !== undefined)
                e.preventDefault()
            this.setState({modal: true})
        }
        const hide = (e) => {
            if (e !== undefined)
                e.preventDefault()
            this.setState({modal: false})
        }

        const saveAndHide = (e) => {
            if (e !== undefined)
                e.preventDefault()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        const declineAndHide = (e) => {
            manager.declineAll()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        var changesText

        if (manager.changed)
            changesText = <p className="cn-changes">{t(['consentNotice', 'changeDescription'])}</p>

        if (manager.confirmed && !show)
            return <div />

        const modalIsOpen =
            modal
            || (show && modal === undefined)
            || (config.mustConsent && !manager.confirmed)
        const noticeIsVisible =
            !config.mustConsent && !manager.confirmed && !config.noNotice

        if (modal || (show && modal === undefined) || (config.mustConsent && !manager.confirmed))
            return <ConsentModal t={t} config={config} hide={hide} declineAndHide={declineAndHide} saveAndHide={saveAndHide} manager={manager} />
        return <div className={`cookie-notice ${!noticeIsVisible ? 'cookie-notice-hidden' : ''}`}>
            <div className="cm-bg" />
            <div className="cn-body">
                <div className="cn-info">
                    <h1 className="title">{t(['consentModal', 'title'])}</h1>
                    <p>
                        {t(['consentNotice', 'description'], {purposes: <strong>{purposesText}</strong>})}
                    </p>
                    {changesText}
                </div>
                <div className="cn-ok">
                    <button className="cm-btn cm-btn-success" type="button" onClick={saveAndHide}>{t(['ok'])}</button>
                    <button className="cm-btn-link" type="button" onClick={showModal}>{t(['customize'])}</button>
                </div>
            </div>
        </div>
    }
}
