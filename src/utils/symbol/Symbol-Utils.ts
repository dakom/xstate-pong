export const getSymbolString = (sym:Symbol) => {
    const str = sym.toString();
    return str.substring(7, str.length-1);
}
