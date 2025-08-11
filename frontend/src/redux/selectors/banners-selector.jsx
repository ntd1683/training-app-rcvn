import { createSelector } from '@reduxjs/toolkit';

const selectBannerState = (state) => state.banners;

export const selectBanners = createSelector(
  [selectBannerState],
  (bannerState) => bannerState.data
);

export const selectBannersSlide = createSelector(
  [selectBannerState],
  (bannerState) => bannerState.dataSlide
);

export const selectBannersStatic = createSelector(
  [selectBannerState],
  (bannerState) => bannerState.dataStatic?.[0]
);

export const selectBannersText = createSelector(
  [selectBannerState],
  (bannerState) => bannerState.dataText?.[0]
);

export const selectBannersAdsCheckout = createSelector(
  [selectBannerState],
  (bannerState) => bannerState.dataAdsCheckout?.[0]
);

export const selectLoading = createSelector(
  [selectBannerState],
  (bannerState) => bannerState.loading
);

export const selectIsLoading = createSelector(
  [selectLoading],
  (loadingState) => loadingState.isLoading
);

export const selectIsLoadingSlide = createSelector(
  [selectLoading],
  (loadingState) => loadingState.isLoadingSlide
);

export const selectIsLoadingStatic = createSelector(
  [selectLoading],
  (loadingState) => loadingState.isLoadingStatic
);

export const selectIsLoadingText = createSelector(
  [selectLoading],
  (loadingState) => loadingState.isLoadingText
);

export const selectIsLoadingAdsCheckout = createSelector(
  [selectLoading],
  (loadingState) => loadingState.isLoadingAdsCheckout
);