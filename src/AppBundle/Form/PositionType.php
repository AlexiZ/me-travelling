<?php
namespace AppBundle\Form;

use AppBundle\Entity\Position;
use FM\ElfinderBundle\Form\Type\ElFinderType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PositionType extends AbstractType
{
    /**
     * @inheritDoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'title',
                TextType::class,
                [
                    'label' => 'position.form.title',
                    'attr' => [
                        'placeholder' => 'position.form.title'
                    ],
                    'required' => true
                ]
            )
            ->add(
                'description',
                TextareaType::class,
                [
                    'label' => 'position.form.description',
                    'attr' => [
                        'placeholder' => 'position.form.description'
                    ],
                    'required' => false
                ]
            )
            ->add(
                'image',
                ElFinderType::class,
                [
                    'label' => 'position.form.image',
                    'required' => false
                ]
            )
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Position::class,
        ]);
    }
}