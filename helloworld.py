def split(string):
    size= len(string)
    p=size//5
    all=[]
    for i in range(0,size,p):
        x=[string[i], string[i+1]]
        all.append(x)
    return all
print(split("Aadarssshs"))
        