import { Badge } from "@modules/common/components/ui"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">Da configurare:</span> nessun metodo di
      pagamento reale è ancora collegato. L&apos;ordine viene registrato come
      test.
    </Badge>
  )
}

export default PaymentTest
