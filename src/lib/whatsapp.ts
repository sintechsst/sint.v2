export async function sendWhatsApp(destino: string, pdfPath: string) {
  console.log('📲 WhatsApp enviado para:', destino)
  console.log('📄 PDF:', pdfPath)

  // Exemplo Twilio:
  // await fetch('https://api.twilio.com/xxxx', {
  //   method: 'POST',
  //   headers: { Authorization: 'Bearer TOKEN' },
  //   body: JSON.stringify({
  //     to: destino,
  //     message: 'Sua Ordem de Serviço está pronta!',
  //     media: pdfPath
  //   })
  // })

  return true
}
