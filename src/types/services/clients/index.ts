export type Organization = {
  id: string;
  name: string;
  display_name?: string | undefined;
  branding?:
    | {
        logo_url?: string | undefined;
        colors?:
          | {
              primary: string;
              page_background: string;
            }
          | undefined;
      }
    | undefined;
  metadata?: any;
};
