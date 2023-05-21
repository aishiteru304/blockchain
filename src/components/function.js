

const handleGenderChange = (e) => {

    if (e.target.value === 'male') return "Nam"
    else return "Nữ"

}

const handleChangeDay = (date) => {
    date = new Date(date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

export { handleGenderChange, handleChangeDay }