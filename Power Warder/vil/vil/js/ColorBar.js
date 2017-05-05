function ColorBar(value) {
    if (value == 0)
        return "white"
    else if (value <= 100)
        return "green"
    else if (value <= 1000)
        return "yellow"
    else if (value <= 10000)
        return "orange"
    else if (value <= 100000)
        return "red"
    else if (value <= 150000)
        return "purple"
    else if (value <= 1000000)
        return "darkblue"
    else
        return "black"
    //return "rgb("+r+","+g+","+b+")";
}
