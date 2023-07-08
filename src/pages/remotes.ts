import { http } from '../_tosslib/utils/http';

/** 키패드 데이터 생성 API
 * 요청과 응답 타입은 함수의 입출력 타입을 확인해주세요. */
export function createKeypad() {
  return http.post<CreateKeypad>('/api/keypad');
}

type KeypadInputResult = {
  uid: string;
  coords: Array<{ x: number; y: number }>;
};

/** 비밀번호 제출 API
 * 요청과 응답 타입은 함수의 입출력 타입을 확인해주세요. */
export function submitPassword(password: KeypadInputResult, confirmPassword: KeypadInputResult) {
  return http.post('/api/password', { password, confirmPassword });
}

export interface CreateKeypad {
  uid: string;
  keypad: {
    functionKeys: Array<{
      symbol: string;
      rowIndex: number;
      columnIndex: number;
    }>;
    size: {
      rows: number;
      columns: number;
    };
    svgGrid: string[][];
  };
}
