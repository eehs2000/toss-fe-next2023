import { Button } from '_tosslib/components/Button';
import { Input } from '_tosslib/components/Input';
import { Spacing } from '_tosslib/components/Spacing';
import { Txt } from '_tosslib/components/Txt';
import colors from '_tosslib/constants/colors';
import { createKeypad, submitPassword } from './remotes';
import { PwdKeypad } from '_tosslib/components/PwdKeypad';
import { useState } from 'react';

type Coordinate = {
  x: any;
  y: any;
};

export function KeypadPage() {
  const [keypadData, setKeypadData] = useState<string[][]>([]);
  const [confirmKeypadData, setConfirmKeypadData] = useState<string[][]>([]);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [activeInput, setActiveInput] = useState<'password' | 'confirm' | ''>('');
  const [pwdUid, setPwdUid] = useState('');
  const [confirmUid, setConfirmUid] = useState('');
  const [loading, setLoading] = useState(true);

  const [pwdDone, setPwdDone] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);

  let pwdCor: Coordinate[] = [];
  let confirmCor: Coordinate[] = [];

  const onFocus = async (type: 'password' | 'confirm') => {
    setLoading(true);
    setActiveInput(type);
    if (type === 'password') {
      if (!pwdUid) {
        const res = await createKeypad();
        console.log(res);
        setPwdUid(res.uid);
        setKeypadData(res.keypad.svgGrid);
      }
    } else {
      if (!confirmUid) {
        const res = await createKeypad();
        console.log(res);
        setConfirmUid(res.uid);
        setConfirmKeypadData(res.keypad.svgGrid);
      }
    }
    setLoading(false);
  };

  const onBlur = () => {
    console.log('blur');
    if (activeInput === 'password') {
      if (pwdDone) {
        return;
      }
      setPassword('');
      pwdCor = [];
    } else {
      if (confirmDone) {
        return;
      }
      setConfirmPassword('');
      confirmCor = [];
    }
    setActiveInput('');
  };

  const onSvgClick = (coordinate: { x: string; y: string }) => {
    console.log(coordinate);
    if (activeInput === 'password') {
      if (password.length < 6) {
        setPassword(prevPassword => prevPassword + '*');
        pwdCor.push(coordinate);
      }
    } else {
      if (confirmPassword.length < 6) {
        setConfirmPassword(prevConfirmPassword => prevConfirmPassword + '*');
        confirmCor.push(coordinate);
      }
    }
  };

  const onReset = () => {
    if (activeInput === 'password') {
      setPassword('');
      pwdCor = [];
      console.log(password);
    } else {
      setConfirmPassword('');
      confirmCor = [];
    }
  };

  const onErase = () => {
    if (activeInput === 'password') {
      setPassword(prevPassword => prevPassword.slice(0, -1));
      pwdCor.pop();
    } else {
      setConfirmPassword(prevConfirmPassword => prevConfirmPassword.slice(0, -1));
      confirmCor.pop();
    }
  };

  const onConfirm = () => {
    if (activeInput === 'password') {
      if (password.length === 6) {
        setActiveInput('');
        setPwdDone(true);
      }
    } else {
      if (confirmPassword.length === 6) {
        setActiveInput('');
        setConfirmDone(true);
      }
    }
  };

  const onSubmit = async () => {
    if (pwdDone && confirmDone) {
      console.log(pwdCor);
      console.log(confirmCor);
      const reqPwd = { uid: pwdUid, coords: pwdCor };
      const reqConfirm = { uid: confirmUid, coords: confirmCor };
      const res = await submitPassword(reqPwd, reqConfirm);
      console.log(res);
    }
  };

  return (
    <section>
      <Txt typography="h1" color={colors.black}>
        토스 보안키패드 기술과제
      </Txt>
      <Input label="비밀번호">
        <Input.TextField
          type="password"
          value={password}
          readOnly
          onFocus={() => onFocus('password')}
          onBlur={onBlur}
        />
      </Input>
      {activeInput === 'password' && !loading && (
        <PwdKeypad
          svgGrid={keypadData}
          onSvgClick={onSvgClick}
          onReset={onReset}
          onErase={onErase}
          onConfrim={onConfirm}
          onRefresh={() => onFocus('confirm')}
        />
      )}
      <Spacing size={24} />
      <Input label="비밀번호 확인">
        <Input.TextField
          type="password"
          value={confirmPassword}
          readOnly
          onFocus={() => onFocus('confirm')}
          onBlur={onBlur}
        />
      </Input>
      {activeInput === 'confirm' && !loading && (
        <PwdKeypad
          svgGrid={confirmKeypadData}
          onSvgClick={onSvgClick}
          onReset={onReset}
          onErase={onErase}
          onConfrim={onConfirm}
          onRefresh={() => onFocus('confirm')}
        />
      )}
      <Spacing size={24} />
      <Button css={{ width: '100%' }} onMouseDown={onSubmit}>
        완료
      </Button>
    </section>
  );
}
