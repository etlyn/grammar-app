import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';

type IconProps = {
  color?: string;
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

type RenderIcon = () => React.ReactNode;

const iconPaths: Record<string, RenderIcon> = {
  home: () => (
    <>
      <Path d="M3 11.5 12 4l9 7.5" />
      <Path d="M5 10.5V21h14V10.5" />
      <Path d="M9.5 21v-6h5v6" />
    </>
  ),
  layers: () => (
    <>
      <Path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <Path d="m3 12 9 5 9-5" />
      <Path d="m3 16 9 5 9-5" />
    </>
  ),
  'play-circle': () => (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Path d="m10 8 6 4-6 4V8Z" />
    </>
  ),
  'book-open': () => (
    <>
      <Path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H21v17H8a4 4 0 0 0-4 4V5.5Z" />
      <Path d="M4 5.5V23" />
      <Path d="M8 6h9" />
      <Path d="M8 10h9" />
    </>
  ),
  moon: () => <Path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  sun: () => (
    <>
      <Circle cx="12" cy="12" r="4" />
      <Line x1="12" y1="2" x2="12" y2="4" />
      <Line x1="12" y1="20" x2="12" y2="22" />
      <Line x1="4.9" y1="4.9" x2="6.3" y2="6.3" />
      <Line x1="17.7" y1="17.7" x2="19.1" y2="19.1" />
      <Line x1="2" y1="12" x2="4" y2="12" />
      <Line x1="20" y1="12" x2="22" y2="12" />
    </>
  ),
  check: () => <Polyline points="20 6 9 17 4 12" />,
  x: () => (
    <>
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  'arrow-right': () => (
    <>
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </>
  ),
  'rotate-ccw': () => (
    <>
      <Polyline points="1 4 1 10 7 10" />
      <Path d="M3.5 15A9 9 0 1 0 4 6.5L1 10" />
    </>
  ),
  search: () => (
    <>
      <Circle cx="11" cy="11" r="7" />
      <Line x1="16.5" y1="16.5" x2="21" y2="21" />
    </>
  ),
  target: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="12" cy="12" r="5" />
      <Circle cx="12" cy="12" r="1" />
    </>
  ),
  award: () => (
    <>
      <Circle cx="12" cy="8" r="5" />
      <Path d="m8.5 12.5-2 8 5.5-3 5.5 3-2-8" />
    </>
  ),
  'chevron-right': () => <Polyline points="9 18 15 12 9 6" />,
  filter: () => (
    <>
      <Path d="M3 5h18" />
      <Path d="M6 12h12" />
      <Path d="M10 19h4" />
    </>
  ),
  circle: () => <Circle cx="12" cy="12" r="9" />,
  square: () => <Rect x="5" y="5" width="14" height="14" rx="4" />,
};

export const FeatherIcon = ({
  color = '#111827',
  name,
  size = 24,
  style,
}: IconProps) => {
  const renderIcon = iconPaths[name] ?? iconPaths.circle;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      style={style}
    >
      {renderIcon()}
    </Svg>
  );
};
