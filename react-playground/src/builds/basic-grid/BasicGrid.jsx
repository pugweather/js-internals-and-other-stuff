import styles from "./BasicGrid.module.css"

export default function BasicGrid() {

    const data = [
        {
            title: "Test 1",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 2",
            text: "Lorem Ipsum is simply dummy text sum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 3",
            text:  "Lorem Ipsum has been ts slation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 4",
            text: "Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 5",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 6",
            text: "Typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 7",
            text: "Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 8",
            text: "Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 9",
            text: "Lorem Ipsum is simply dummy text of Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        },
        {
            title: "Test 10",
            text: "Lorem Ipsum survived"
        },
        {
            title: "Test 11",
            text: "and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived"
        }
    ]

    return (
        <div className={styles.wrapper}>
            {
                data.map(d => (
                    <div key={d.title} className={styles.card}>
                        <div className={styles.title}>{d.title}</div>
                        <div>{d.text}</div>
                    </div>
                ))
            }
        </div>
    )
}