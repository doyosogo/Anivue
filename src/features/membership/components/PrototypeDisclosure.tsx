import { ANIVUE_PROTOTYPE_DISCLOSURE } from '../content/prototypeDisclosure';

type PrototypeDisclosureProps = {
  className?: string;
};

export function PrototypeDisclosure({ className = '' }: PrototypeDisclosureProps) {
  return (
    <p className={`text-xs leading-5 text-muted ${className}`}>
      {ANIVUE_PROTOTYPE_DISCLOSURE}
    </p>
  );
}
