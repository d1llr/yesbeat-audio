import React,{memo} from 'react'
import warningIcon from '../../../imgs/warning.png'


export default memo(function Warning(props) {
    return (
        <div className={props.className}>
            <img src={warningIcon} />
            <span>
                <b>Запрещено</b> распространять музыку и выкладывать в соц. сети
            </span>
        </div>
    )
})
