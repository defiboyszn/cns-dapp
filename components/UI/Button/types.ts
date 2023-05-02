export interface ICNSButton {
  variant?: BtnVariant;
  text: string;
  full_width?: boolean;
  on_click?: () => void;
}

export enum BtnVariant {
  primary = 'primary',
  secondary = 'secondary',
  outline = 'outline',
  tertiary = 'tertiary',
}
