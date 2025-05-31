import { Injectable } from '@angular/core';
import {
  signUp, confirmSignUp, signIn, confirmSignIn,
} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

async signUpWithEmail(email: string) {
    console.log('AuthService::signUpWithEmail()::email: ', email)

    try {
      const { nextStep } = await signUp({
        username: email,
        options: {
          userAttributes: { email },
        },
      });

      if (nextStep.signUpStep === 'DONE') {
        return { status: 'DONE' };
      }

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        return {
          status: 'CONFIRM_SIGN_UP',
          destination: nextStep.codeDeliveryDetails.destination,
        };
      }

      return { status: 'UNKNOWN' };
    } catch (error: any) {
      if (error.name === 'UsernameExistsException') {
        console.warn('User already exists');
        return { status: 'USER_ALREADY_EXISTS' };
      }

      console.error('Unexpected sign-up error:', error);
      return { status: 'ERROR', message: error.message || 'Unknown error' };
    }
  }


  async confirmEmailSignUp(email: string, code: string) {
    console.log('AuthService::confirmEmailSignUp()::email|code: ', email, code)
    const { nextStep } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    return nextStep.signUpStep === 'DONE';
  }


  async signInWithEmail(email: string) {
    console.log('AuthService::signInWithEmail()::email: ', email)

    const { nextStep } = await signIn({
      username: email,
      options: {
        authFlowType: 'USER_AUTH',
        preferredChallenge: 'EMAIL_OTP',
      },
    });

    console.log('AuthService::signInWithEmail()::nextStep: ', nextStep)

    if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE')
      return { status: 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' };

    if (nextStep.signInStep === 'DONE') return { status: 'DONE' };

    return { status: 'UNKNOWN' };
  }

  async confirmEmailSignIn(code: string) {
    const { nextStep } = await confirmSignIn({
      challengeResponse: code,
    });

    return nextStep.signInStep === 'DONE';
  }
}
