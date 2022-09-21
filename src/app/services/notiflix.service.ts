import { Injectable } from '@angular/core';
import * as Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class NotiflixService {

  constructor() {
    Notiflix.Block.init({});
    Notiflix.Loading.init({});
    Notiflix.Report.init({});
    Notiflix.Notify.init({});
    Notiflix.Confirm.init({});
  }

  openLoader({ messageOrOptions = '', options = {} }) {
    Notiflix.Loading.hourglass(messageOrOptions, options);
  }

  closeLoader({ delay = 1000 }) {
    Notiflix.Loading.remove(delay);
  }

  report(
    {
      type = TypesOfReport.Success,
      title = 'Alerta del sistema',
      message = 'Mensaje por defecto del sistema',
      buttonText = 'Aceptar',
      callbackOrOptions = () => { },
      options = {}
    }: IOptionsNotiflix
  ) {
    let typesNotiflix: typesNotiflix = {
      success:
        (title: string, message: string, buttonText: string, callbackOrOptions: any, options: any): void =>
          Notiflix.Report.success(title, message, buttonText, callbackOrOptions, options),
      failure:
        (title: string, message: string, buttonText: string, callbackOrOptions: any, options: any): void =>
          Notiflix.Report.failure(title, message, buttonText, callbackOrOptions, options),
      warning:
        (title: string, message: string, buttonText: string, callbackOrOptions: any, options: any): void =>
          Notiflix.Report.warning(title, message, buttonText, callbackOrOptions, options),
      info:
        (title: string, message: string, buttonText: string, callbackOrOptions: any, options: any): void =>
          Notiflix.Report.info(title, message, buttonText, callbackOrOptions, options),
    }
    switch (type) {
      case 'success':
        typesNotiflix.success(title, message, buttonText, callbackOrOptions, options);
        break;
      case 'failure':
        typesNotiflix.failure(title, message, buttonText, callbackOrOptions, options);
        break;
      case 'warning':
        typesNotiflix.warning(title, message, buttonText, callbackOrOptions, options);
        break;
      case 'info':
        typesNotiflix.info(title, message, buttonText, callbackOrOptions, options);
        break;
    }
  }

  confirm({
    title = 'Alerta del sistema',
    message = 'Mensaje por defecto',
    okButtonText = 'Aceptar',
    cancelButtonText = 'Cancelar',
    okButtonCallback = () => { },
    cancelButtonCallback = () => { },
    options = {}
  }: {
    title?: string,
    message?: string,
    okButtonText?: string,
    cancelButtonText?: string,
    okButtonCallback?: (() => void),
    cancelButtonCallback?: (() => void),
    options?: any
  }) {
    Notiflix.Confirm.show(
      title,
      message,
      okButtonText,
      cancelButtonText,
      okButtonCallback,
      cancelButtonCallback,
      options
    )
  }

  notify({ type = 'success', message = '', callbackOrOptions = () => { }, options = {} }) {
    let typesOfNotify: typesNotiflixNotify = {
      success: (message, callbackOrOptions, options) => {
        Notiflix.Notify.success(message, callbackOrOptions, options)
      },
      failure: (message, callbackOrOptions, options) => {
        Notiflix.Notify.failure(message, callbackOrOptions, options)
      },
      warning: (message, callbackOrOptions, options) => {
        Notiflix.Notify.warning(message, callbackOrOptions, options)
      },
      info: (message, callbackOrOptions, options) => {
        Notiflix.Notify.info(message, callbackOrOptions, options)
      },
    }
    switch (type) {
      case 'success':
        typesOfNotify.success(message, callbackOrOptions, options);
        break;
      case 'failure':
        typesOfNotify.failure(message, callbackOrOptions, options);
        break;
      case 'warning':
        typesOfNotify.warning(message, callbackOrOptions, options);
        break;
      case 'info':
        typesOfNotify.info(message, callbackOrOptions, options);
        break;
    }

  }
}

interface typesNotiflix {
  success: NotiflixReportFunction,
  failure: NotiflixReportFunction,
  warning: NotiflixReportFunction,
  info: NotiflixReportFunction,
}

interface typesNotiflixNotify {
  success: NotiflixNotifyFunction,
  failure: NotiflixNotifyFunction,
  warning: NotiflixNotifyFunction,
  info: NotiflixNotifyFunction,
}

type NotiflixNotifyFunction = (
  message: string,
  callbackOrOptions?: () => void,
  options?: any
) => void;

type NotiflixReportFunction =
  (
    title: string,
    message: string,
    buttonText: string,
    callbackOrOptions: any,
    options: any
  ) => void;

interface IOptionsNotiflix {
  type?: TypesOfReport,
  title?: string,
  message: string,
  buttonText?: string,
  callbackOrOptions?: any,
  options?: any,
}

export enum TypesOfReport {
  Success = 'success',
  Failure = 'failure',
  Warning = 'warning',
  Info = 'info',
}
