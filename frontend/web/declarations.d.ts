//fixes a missing module error when importing styles.scss files
declare module "*.styles.scss" {
    const content: string;
    export = content;
}

declare module "*.png" {
    const value: any;
    export = value;
}

declare module "*.svg" {
    const value: any;
    export = value;
}

declare module "*.jpg" {
    const value: any;
    export = value;
}
