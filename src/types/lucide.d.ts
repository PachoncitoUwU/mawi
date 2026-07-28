declare module 'lucide-react-native' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  export interface IconProps extends SvgProps {
    color?: string;
    size?: number | string;
    strokeWidth?: number | string;
    fill?: string;
  }

  export type Icon = React.FC<IconProps>;

  export const Plus: Icon;
  export const Filter: Icon;
  export const Tag: Icon;
  export const DollarSign: Icon;
  export const Shirt: Icon;
  export const Sparkles: Icon;
  export const Check: Icon;
  export const X: Icon;
  export const ArrowUp: Icon;
  export const ArrowDown: Icon;
  export const Layers: Icon;
  export const User: Icon;
  export const Sliders: Icon;
  export const RotateCw: Icon;
  export const ShoppingBag: Icon;
  export const CheckCircle2: Icon;
  export const AlertTriangle: Icon;
  export const XCircle: Icon;
  export const RefreshCw: Icon;
  export const Zap: Icon;
  export const ShieldCheck: Icon;
  export const Heart: Icon;
  export const TrendingUp: Icon;
  export const Bookmark: Icon;
  export const Search: Icon;
  export const Sun: Icon;
  export const Moon: Icon;
  export const Settings: Icon;
  export const LogIn: Icon;
  export const LogOut: Icon;
  export const Key: Icon;
}
