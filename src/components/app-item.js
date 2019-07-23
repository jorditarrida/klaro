import React from 'react'

export default class AppItem extends React.Component {

    render(){
        const {checked, onToggle, name, title, description, cookies, t} = this.props
        const required = this.props.required || false
        const optOut = this.props.optOut || false
        const purposes = this.props.purposes || []
        const onChange = (e) => {
            onToggle(e.target.checked)
        }
        const id = `app-item-${name}`
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")
        const optOutText = optOut ? <span class="cm-opt-out" title={t(['app', 'optOut', 'description'])}>{t(['app', 'optOut', 'title'])}</span> : ''
        const requiredText = required ? <span class="cm-required" title={t(['app', 'required', 'description'])}>{t(['app', 'required', 'title'])}</span> : ''

        let purposesContent
        if (purposes.length > 0)
            purposesContent = <p className="purposes">{t(['app', purposes.length > 1 ? 'purposes' : 'purpose'])}: {purposesText}</p>

        return <div>
            <input id={id} class="cm-app-input" aria-describedby={`${id}-description`} disabled={required} checked={checked || required} type="checkbox" onChange={onChange} />
            <label for={id} class="cm-app-label" {...(required ? {tabIndex: "0"} : {})}>
                <span className="cm-app-title">{title}</span>{requiredText}{optOutText}
                <span className={"switch"+(required ? " disabled" : "")}>
                    <div className="slider round active"></div>
                </span>
            </label>
            <div id={`${id}-description`}>
                <p className="cm-app-description">{description || t([name, 'description'])}</p>
                {cookies && <p className="cm-app-cookies">{t(['consentModal','cookies'])} {cookies.join(', ')}</p>}
                {purposesContent}
            </div>
        </div>
    }

}