// TAIGA


import {
	TuiActiveZone,
	
	TuiAutoFocus,

	TuiClickOutside,
	TuiControl,
	TuiCopyProcessor,

	TuiDroppable,
	TuiElement,
	TuiFilterPipe,
	TuiFocusTrap,

	TuiFor,
	TuiHighDpi,
	TuiHovered,
	TuiIsPresentPipe,
	TuiItem,
	TuiKeysPipe,
	TuiLet,
	TuiMapperPipe,
	TuiMedia,
	TuiObscured,

	TuiPan,
	TuiPlatform,

	TuiRepeatTimes,
	TuiReplacePipe,

	TuiResizer,

	TuiSwipe,
	TuiValidator,
	TuiValueChanges,
	TuiZoom
} from '@taiga-ui/cdk';


import {
	 TuiIcon, 
	

	TuiAlert,
	TuiButton,
	TuiCalendar,
	TuiCalendarSheetPipe,
	TuiDataList,
	TuiDialog,
	TuiDropdown,
	TuiError,
	TuiExpand,
	TuiFlagPipe,
	TuiFormatDatePipe,
	TuiFormatNumberPipe,

	TuiGroup,
	TuiHint,

	TuiLabel,
	TuiLink,
	TuiLoader,

	TuiMonthPipe,
	TuiNotification,
	TuiNumberFormat,

	TuiRoot,
	TuiScrollIntoView,
	TuiScrollbar,

} from '@taiga-ui/core';
import {
	TuiSegmented,TuiSkeleton ,TuiButtonGroup, TuiChip, 
	TuiAccordion,

	TuiAvatar,
	TuiBadge,
	TuiBadgedContent,
	TuiBreadcrumbs,
	TuiCalendarMonth,
	TuiCalendarRange,
	TuiCarousel,

	TuiCheckbox,

	TuiDataListDropdownManager,
	TuiDataListWrapper,
	TuiElasticContainer,

	TuiFieldErrorPipe,
	TuiFiles,
	TuiFilterByInputPipe,
	TuiFilter,
	TuiHighlight,

	TuiInputFiles,
	TuiInputInline,

	TuiInputPhoneInternational,


	TuiItemsWithMore,

	TuiLineClamp,


	TuiPagination,

	TuiPresent,

	TuiProgress,

	TuiPush,

	TuiRadioList,
	TuiRadio,
	TuiRange,
	TuiRating,

	TuiSlider,
	TuiSortCountriesPipe,
	TuiStepper,
	TuiStringifyContentPipe,
	TuiStringifyPipe,
	TuiTabs,

	TuiTiles,

	TuiTree,
	TuiUnfinishedValidator,
	TuiUnmaskHandler,
	
} from '@taiga-ui/kit';


import {
	
	TuiArcChart,
	TuiAxes,
	TuiBarChart,
	TuiBar,
	TuiBarSet,
	TuiLegendItem,
	TuiLineChart,
	TuiLineDaysChart,
	TuiPieChart,
	TuiRingChart
} from '@taiga-ui/addon-charts';
import {
	TuiCard,
	TuiCurrencyPipe,

	TuiInputCVC,

	TuiInputCard,
	TuiInputExpire,

	TuiThumbnailCard
} from '@taiga-ui/addon-commerce';
import {

	TuiDropdownMobile,
	TuiElasticSticky,

	TuiMobileCalendar,
	TuiMobileDialog,

	TuiPullToRefresh,
	TuiRipple,
	TuiSheetDialog,

	TuiSidebar,
	TuiTabBar,

	TuiTouchable
} from '@taiga-ui/addon-mobile';

import {
	TuiTableBarsHostModule
} from '@taiga-ui/addon-tablebars';


	import {  TuiBlockStatus} from '@taiga-ui/layout';

export const TAIGA_MODULES = [
	TuiSegmented,
	TuiChip,
	TuiButtonGroup,
	TuiIcon,

	TuiBlockStatus,
	TuiSkeleton,

	/* CDK */
	TuiActiveZone,

	TuiAutoFocus,

	TuiClickOutside,
	TuiControl,
	TuiCopyProcessor,

	TuiDroppable,
	TuiElement,
	TuiFilterPipe,
	TuiFocusTrap,

	TuiFor,
	TuiHighDpi,
	TuiHovered,
	TuiIsPresentPipe,
	TuiItem,
	TuiKeysPipe,
	TuiLet,
	TuiMapperPipe,
	TuiMedia,
	TuiObscured,

	TuiPan,
	TuiPlatform,

	TuiRepeatTimes,
	TuiReplacePipe,
	
	TuiResizer,
	TuiSwipe,
	TuiValidator,
	TuiValueChanges,
	TuiZoom,
	/* CORE */
	TuiAlert,
	TuiButton,
	TuiCalendar,
	TuiCalendarSheetPipe,
	TuiDataList,
	TuiDialog,
	TuiDropdown,
	TuiError,
	TuiExpand,
	TuiFlagPipe,
	TuiFormatDatePipe,
	TuiFormatNumberPipe,

	TuiGroup,
	TuiHint,

	TuiLabel,
	TuiLink,
	TuiLoader,

	TuiMonthPipe,
	TuiNotification,
	TuiNumberFormat,

	TuiRoot,
	TuiScrollIntoView,
	TuiScrollbar,
	
	/* KIT */

	TuiAccordion,

	TuiAvatar,
	TuiBadge,
	TuiBadgedContent,
	TuiBreadcrumbs,
	TuiCalendarMonth,
	TuiCalendarRange,
	TuiCarousel,

	TuiCheckbox,

	TuiDataListDropdownManager,
	TuiDataListWrapper,
	TuiElasticContainer,

	TuiFieldErrorPipe,
	TuiFiles,
	TuiFilterByInputPipe,
	TuiFilter,
	TuiHighlight,

	TuiInputFiles,
	TuiInputInline,

	TuiInputPhoneInternational,

	TuiItemsWithMore,

	TuiLineClamp,

	TuiPagination,

	TuiPresent,

	TuiProgress,

	TuiPush,

	TuiRadioList,
	TuiRadio,
	TuiRange,
	TuiRating,

	TuiSlider,
	TuiSortCountriesPipe,
	TuiStepper,
	TuiStringifyContentPipe,
	TuiStringifyPipe,
	TuiTabs,

	TuiTiles,

	TuiTree,
	TuiUnfinishedValidator,
	TuiUnmaskHandler,


	/* ADDON-CHARTS */
	TuiArcChart,
	TuiAxes,
	TuiBarChart,
	TuiBar,
	TuiBarSet,
	TuiLegendItem,
	TuiLineChart,
	TuiLineDaysChart,
	TuiPieChart,
	TuiRingChart,
	/* ADDON-COMMERCE */

	TuiCurrencyPipe,

	TuiInputCVC,

	TuiInputCard,
	TuiInputExpire,

	TuiThumbnailCard,
	/* ADDON-MOBILE */

	TuiDropdownMobile,
	TuiElasticSticky,

	TuiMobileCalendar,
	TuiMobileDialog,

	TuiPullToRefresh,
	TuiRipple,
	TuiSheetDialog,

	TuiSidebar,
	TuiTabBar,
	
	TuiTouchable,
	/* ADDON-PREVIEW */
	// TuiPreviewAction,
	// TuiPreviewDialog,
	// TuiPreview,
	/* ADDON-TABLE */
	// TuiReorder,
	// TuiTableFilters,
	// TuiTable,
	// TuiTablePagination,
	/* ADDON-TABLEBARS */

	/* EXAMPLE MODULES */
	

];
