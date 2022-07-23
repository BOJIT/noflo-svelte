export type Icon = {
    name: string,
    icon: string,
    description?: string,
    inports: Object[],
    outports: Object[],
}

export type IconLibrary = {
    [key: string]: Icon
}
