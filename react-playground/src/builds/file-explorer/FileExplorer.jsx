import { useState } from "react"
import styles from "./FileExplorer.module.css"

export default function FileExplorer({ data }) {

    return (
        <div>
            {data.map(file => <FileItem file={file} />)}
        </div>
    );
}

function FileItem({ file }) {

    const isDirectory = file?.children
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div>
            {
                isDirectory ? (
                    <div>
                        <div className={styles.fileItemDirectory} onClick={() => setIsExpanded(prev => !prev)}>{`${file.name} [${isExpanded ? '-' : '+'}]`}</div>
                        {isExpanded && [...file.children].sort((a,b) => a.name.localeCompare(b.name)).map(file =>( 
                            <div key={file.id} style={{paddingLeft: "20px"}}>       
                                <FileItem file={file} />
                            </div>
                        ))}
                    </div>
                ) :
                (
                    <div>{file.name}</div>
                )
                
            }
        </div>
    )
}