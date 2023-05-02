const Badge = (props: any) => {
    return (
        <p className={`text-sm leading-5 font-medium ${props.available ? 'text-green-500 bg-teal-100 ' : 'text-red-500 bg-red-100 '} inline mr-5 rounded-[10000px] p-[2px_10px]`}>
            {props.available ? "Available" : "Sold"}
        </p>
    )
}

export {Badge}