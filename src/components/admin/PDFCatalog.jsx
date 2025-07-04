import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Path,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#1a1a2e',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 9,
    color: '#fff',
    letterSpacing: 0.5,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    color: '#002244',
    borderBottom: '1pt solid #ccc',
    paddingBottom: 4,
    textAlign: 'left',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  productCard: {
    width: '30%',
    padding: 2,
    margin: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    textAlign: 'center',
    border: '1pt solid darkblue',
  },
  productImage: {
    width: '100%',
    height: 140,
    objectFit: 'contain',
    marginBottom: 4,
    alignSelf: 'center',
  },
  productInfo: {
    fontSize: 9,
    color: '#333',
    textAlign: 'center',
  },
  productCode: {
    fontWeight: 'bold',
    color: '#000',
  },
  tallasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  sizeBox: {
    border: '1pt solid #333',
    borderRadius: 4,
    width: 18,
    height: 18,
    fontSize: 8,
    marginRight: 4,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 2,
  },
  //Contacto
  contactoPage: {
    padding: 40,
    backgroundColor: '#e8ecf4',
    color: '#001f3f',
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  heading: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#001f3f',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  text: {
    fontSize: 10,
    color: '#001f3f',
  },
});

const groupByCategory = (products) => {
  return products.reduce((acc, product) => {
    if (!acc[product.usuario]) acc[product.usuario] = [];
    acc[product.usuario].push(product);
    return acc;
  }, {});
};

const Icon = ({ path }) => (
  <Svg viewBox="0 0 24 24" style={styles.icon}>
    <Path d={path} fill="#001f3f" />
  </Svg>
);

const icons = {
  phone: "M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.2.5 2.5.76 3.8.76a1 1 0 011 1V20a1 1 0 01-1 1C10.74 21 3 13.26 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.3.26 2.6.76 3.8a1 1 0 01-.27 1.11l-2.2 2.2z",
clock: "M12 1a11 11 0 1 0 0.001 22.001A11 11 0 0 0 12 1zm0 2a9 9 0 1 1 0 18A9 9 0 0 1 12 3zm-.5 4v5.25l4.5 2.67.75-1.23-3.75-2.19V7H11.5z",  facebook: "M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.2c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12H18l-.5 3h-2.2v7A10 10 0 0022 12z",
  instagram: "M7 2C4.79 2 3 3.79 3 6v12c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4H7zm10 2c1.1 0 2 .9 2 2v2h-2V6c0-.55-.45-1-1-1h-2V4h3zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z",
  whatsapp: "M20.52 3.48A11.85 11.85 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.1 1.58 5.9L0 24l6.27-1.64A11.9 11.9 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.87 9.87 0 01-5.1-1.4l-.36-.22-3.72.97.99-3.6-.24-.38A9.89 9.89 0 012 12C2 6.48 6.48 2 12 2c2.66 0 5.19 1.04 7.07 2.93A9.94 9.94 0 0122 12c0 5.52-4.48 10-10 10zm5.01-7.11c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14s-.7.88-.86 1.06c-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.33-.8-.71-1.33-1.59-1.48-1.86-.15-.27-.02-.42.11-.56.12-.13.27-.33.4-.5.13-.17.17-.29.26-.48.09-.18.05-.36-.02-.5-.07-.14-.61-1.47-.84-2-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.71.33s-.93.91-.93 2.23c0 1.32.96 2.59 1.1 2.77.14.18 1.89 2.89 4.6 4.05.64.28 1.14.45 1.53.57.64.2 1.23.17 1.7.1.52-.08 1.61-.66 1.84-1.3.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.52-.32z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
};

const PDFCatalog = ({ products, contacto }) => {
  const today = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const grouped = groupByCategory(products);

  return (
    <Document>
      {/* Portada */}
      <Page
        size="A4"
        orientation="landscape"
        style={{ padding: 0, margin: 0, position: 'relative' }}
      >
        <Image
          src="https://res.cloudinary.com/ddebdvfcg/image/upload/v1751581124/catalogo_nikos_2_c3pwan.png"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Page>

      {/* Productos por categoría */}
      {Object.entries(grouped).flatMap(([categoria, items]) => {
        const variantes = items.flatMap((product) =>
          product.variantes?.map((v, i) => ({
            imagen: v.imagen,
            color: v.color,
            codigo: `${product.slug}-${i + 1}`,
            tallas: v.tallas.map((t) => t.talla),
            nombre: product.nombre,
            precio: product.precioDescuento,
          })) || []
        );

        const pages = [];
        for (let i = 0; i < variantes.length; i += 6) {
          pages.push(variantes.slice(i, i + 6));
        }

        return pages.map((grupo, pageIndex) => (
          <Page
            size="A4"
            orientation="landscape"
            style={styles.page}
            key={`${categoria}-${pageIndex}`}
          >
            <View style={styles.categorySection}>
              {pageIndex === 0 && (
                <Text style={styles.categoryTitle}>{categoria}</Text>
              )}
              <View
                style={[
                  styles.productGrid,
                  grupo.length < 6 && { justifyContent: 'center' },
                ]}
              >
                {grupo.map((item, i) => (
                  <View style={styles.productCard} key={i}>
                    <Image src={item.imagen} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={{ fontWeight: 'bold' }}>{item.nombre}</Text>
                      <Text>COLOR: {item.color}</Text>
                      <Text>
                        COD:{' '}
                        <Text style={styles.productCode}>{item.codigo}</Text>
                      </Text>
                      <Text>NIÑOS</Text>
                      <Text>TALLAS:</Text>
                      <View style={styles.tallasRow}>
                        {item.tallas.map((t, i) => (
                          <Text key={i} style={styles.sizeBox}>
                            {t}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text
                style={styles.footerText}
                render={() => `www.nikosperu.com - ${today}`}
                fixed
              />
              <Text
                style={styles.footerText}
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </View>
          </Page>
        ));
      })}

      

      {/* Página de contacto */}
       <Page size="A4" orientation='landscape' style={styles.contactoPage}>
        <Text style={styles.heading}>Contáctanos</Text>

        <View style={styles.infoRow}>
        <Icon path={icons.whatsapp} />
        <Text style={styles.text}>+51 {contacto.telefono}</Text>
        </View>

        <View style={styles.infoRow}>
        <Icon path={icons.location} />
        <Text style={styles.text}>Direccion: {contacto.direccion}</Text>
        </View>

        <View style={styles.infoRow}>
        <Icon path={icons.clock} />
        <Text style={styles.text}>Horario de atención: {contacto.horario}</Text>
        </View>

        <Text style={[styles.heading, { marginTop: 20 }]}>Síguenos:</Text>

        <View style={styles.infoRow}>
        <Icon path={icons.facebook} />
        <Text style={styles.text}>{contacto.facebook}</Text>
        </View>

        <View style={styles.infoRow}>
        <Icon path={icons.instagram} />
        <Text style={styles.text}>{contacto.instagram}</Text>
        </View>
    </Page>
    </Document>
  );
};

export default PDFCatalog;
