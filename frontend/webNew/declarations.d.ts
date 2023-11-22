//fixes a missing module error when importing styles.scss files
declare module "*.styles.scss" {
    const content: string;
    export = content;
}