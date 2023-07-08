import { Button } from '_tosslib/components/Button';
import { Input } from '_tosslib/components/Input';
import { Spacing } from '_tosslib/components/Spacing';
import { Txt } from '_tosslib/components/Txt';
import colors from '_tosslib/constants/colors';

export function KeypadPage() {
  return (
    <section>
      <Txt typography="h1" color={colors.black}>
        토스 보안키패드 기술과제
      </Txt>
      <Input label="비밀번호">
        <Input.TextField />
      </Input>
      <Spacing size={24} />
      <Input label="비밀번호 확인">
        <Input.TextField />
      </Input>
      <Spacing size={24} />
      <Button css={{ width: '100%' }}>완료</Button>
    </section>
  );
}
