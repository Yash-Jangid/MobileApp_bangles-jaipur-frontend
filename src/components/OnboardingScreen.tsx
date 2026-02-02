import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {appleAuthAndroid} from '@invertase/react-native-apple-authentication';

import {Colors, Fonts, Images} from '../common';
import {CustomText} from './ui/CustomText';

const {height} = Dimensions.get('screen');

interface OnboardingScreenProps {
  onOnboardingSkip: () => void;
  signIn: (provider: string) => void;
}

const OnboardingScreen = (props: OnboardingScreenProps) => {
  const {onOnboardingSkip, signIn} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => onOnboardingSkip()}>
        <CustomText style={styles.skip}>Skip</CustomText>
        {/* <Image source={Images.chevron_right} style={styles.arrow} /> */}
      </TouchableOpacity>
      <View style={{marginTop: height * 0.05, minHeight: height * 0.3 + 190}}>
        <Swiper
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={styles.paginationContainer}
          loop={false}>
          <View style={styles.onboardingContainer}>
            {/* <Image source={Images.onboarding1} style={styles.onboardingImg} /> */}
            <CustomText style={styles.title}>Stay in the AI Loop</CustomText>
            <CustomText style={styles.description}>
              Outpost keeps you informed with the latest AI breakthroughs and
              news. Never miss an important update again.
            </CustomText>
          </View>
          <View style={styles.onboardingContainer}>
            {/* <Image source={Images.onboarding2} style={styles.onboardingImg} /> */}
            <CustomText style={styles.title}>
              Discover powerful AI tools
            </CustomText>
            <CustomText style={styles.description}>
              Explore a curated collection of AI tools for every task. Find the
              perfect digital assistant to boost your productivity.
            </CustomText>
          </View>
          <View style={styles.onboardingContainer}>
            {/* <Image source={Images.onboarding3} style={styles.onboardingImg} /> */}
            <CustomText style={styles.title}>
              Build and share your AI toolkit
            </CustomText>
            <CustomText style={styles.description}>
              Create personalized lists of your favorite AI tools. Collaborate
              and innovate by sharing with friends and colleagues.
            </CustomText>
          </View>
        </Swiper>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.signUpContainer}>
          <View style={styles.signUpLine} />
          <CustomText style={styles.signUpTxt}>
            Sign up instantly with
          </CustomText>
          <View style={styles.signUpLine} />
        </View>
        <View style={styles.signUpBtnContainer}>
          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={() => signIn('google')}>
            {/* <Image source={Images.google_icon} style={styles.signUpBtnIcon} /> */}
            <CustomText style={styles.signUpBtnTxt}>Google</CustomText>
          </TouchableOpacity>
          {(Platform.OS === 'ios' ||
            (Platform.OS === 'android' && appleAuthAndroid.isSupported)) && (
            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={() => signIn('apple')}>
              {/* <Image source={Images.apple_icon} style={styles.signUpBtnIcon} /> */}
              <CustomText style={styles.signUpBtnTxt}>Apple</CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  skipBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  skip: {
    color: Colors.primary,
    fontFamily: Fonts.regular,
    fontWeight: Fonts.weight.semiBold,
    lineHeight: 24,
  },
  arrow: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  onboardingImg: {
    height: height * 0.3,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontFamily: Fonts.regular,
    fontWeight: Fonts.weight.semiBold,
    lineHeight: 28,
    marginTop: 24,
    textAlign: 'center',
  },
  description: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    marginTop: 12,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    gap: 8,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  signUpTxt: {
    color: Colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  signUpLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  signUpBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  signUpBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  signUpBtnIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  signUpBtnTxt: {
    color: Colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
    fontWeight: Fonts.weight.semiBold,
  },
});

export {OnboardingScreen};

