export const GenerateSlug = (name:string): string => {
    const spilt = name.split(" ").join("-") 
    const removeOpenParenthesis = spilt.replaceAll("(", "")
    const removecloseParenthesis = removeOpenParenthesis.replaceAll(")", "")
    const removeOpenBrackets = removecloseParenthesis.replaceAll("[", "")
    const removecloseBrackets = removeOpenBrackets.replaceAll("]", "")
    const removecommas = removeOpenBrackets.replaceAll(",", "")

    return removecloseBrackets
}

