import { IconColor, TextColor } from '../../../helpers/constants/design-system';
import { IconName, IconProps, IconSize } from '../icon';
import type { PolymorphicComponentPropWithRef } from '../box';
import type { AvatarBaseStyleUtilityProps } from '../avatar-base/avatar-base.types';

enum AvatarIconSize {
  Xs = 'xs',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
}
const avatarIconSizeToIconSize: Record<AvatarIconSize, IconSize> = { Xs: IconSize['xs'], Sm: IconSize['sm'], Md: IconSize['md'], Lg: IconSize['lg'], Xl: IconSize['xl'] }; // Remove unnecessary brackets around key names for better readability and performance optimization
