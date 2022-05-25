// GraphQL Fragments
const fragments = {
	users: `
		fragment UserFragment on UserFields {
		  _id
		  email
		  fullname
		  verifiedEmail
		  role {
		    name
		  }
		  profilePhoto {
		    url
		  }
		  createdAt
		  updatedAt
		}
	`,
	roles: `
	fragment UserRolesFragment on Role {
		_id
    name
    permissions {
      createUsers
      editUsers
      deleteUsers
      restoreUsers
      createRoles
      editRoles
      deleteRoles
      createTestimonials
      editTestimonials
      deleteTestimonials
      createProducts
      editProducts
      deleteProducts
      affiliateClients
      affiliateEntrepreneurs
      editContactInformacion
    }
	}
	`,
  product: `
    fragment ProductFragment on Product {
      _id
      name
      content
      description
      price
      stock
      usageMode
      categories {
        _id
      }
      benefits {
        _id
        benefit
      }
      images {
        _id
        url
        size
        width
        height
        format
        filename
        public_id
        cloudinary_path
      }
    }
  `,
	products: `
		fragment ProductsFragment on Product {
		  _id
      name
      description
      stock
      defaultImage {
        url
      }
      categories {
        _id
        name
      }
      createdAt
      updatedAt
		}
	`,
  testimonials: `
    fragment TestimonialsFragment on Testimony {
      _id
      author {
        name
        photo {
          url
        }
      }
    }
  `,
  author_testimony: `
    fragment AuthorTestimonyFragment on Testimony {
      _id
      testimony
      author {
        name
        age
        country
        photo {
          url
        }
      }
    }
  `,
  contact: `
    fragment ContactFragment on Contact {
      fullname
      aboutMe
      testimony
      phone
      omnilifeCode
      contactPhoto {
        url
      }
      emails
      socialNetworks {
        twitter {
          _id
          nameOfThePage
          linkOfThePage
        }
        instagram {
          _id
          nameOfThePage
          linkOfThePage
        }
        facebook {
          _id
          nameOfThePage
          linkOfThePage
        }
      }
    }
  `
}

export default fragments
